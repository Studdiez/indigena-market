function parseAllowlist() {
    const raw = process.env.ADMIN_WALLET_ALLOWLIST || '';
    const list = raw
        .split(',')
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);

    // Safe default for local dev if env is not set.
    if (list.length === 0) {
        return ['demo-admin-wallet'];
    }

    return list;
}

function extractWallet(req) {
    const fromHeader = req.headers['x-wallet-address'] || req.headers['x-admin-wallet'];
    const fromBody = req.body?.adminWallet || req.body?.walletAddress || req.body?.moderator;
    const fromQuery = req.query?.adminWallet || req.query?.walletAddress;

    const value = fromHeader || fromBody || fromQuery;
    if (!value || typeof value !== 'string') return '';
    return value.trim().toLowerCase();
}

function requireAdminWallet(req, res, next) {
    const allowlist = parseAllowlist();
    const wallet = extractWallet(req);

    if (!wallet) {
        return res.status(401).send({
            status: false,
            message: 'Admin wallet is required'
        });
    }

    if (!allowlist.includes(wallet)) {
        return res.status(403).send({
            status: false,
            message: 'Admin access denied for this wallet'
        });
    }

    req.adminWallet = wallet;
    return next();
}

module.exports = {
    requireAdminWallet
};
