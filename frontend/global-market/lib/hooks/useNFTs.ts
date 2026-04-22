'use client';

import { useState, useEffect } from 'react';
import { nftAPI } from '../api';

export function useNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNFTs() {
      try {
        setLoading(true);
        const data = await nftAPI.getAll();
        setNfts(data.nfts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, []);

  return { nfts, loading, error };
}

export function useTodayNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToday() {
      try {
        setLoading(true);
        const data = await nftAPI.getTodayNFTs();
        setNfts(data.nfts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch today\'s NFTs');
      } finally {
        setLoading(false);
      }
    }

    fetchToday();
  }, []);

  return { nfts, loading, error };
}

export function useNFT(id: string) {
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNFT() {
      try {
        setLoading(true);
        const data = await nftAPI.getById('', id);
        setNft(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NFT');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchNFT();
    }
  }, [id]);

  return { nft, loading, error };
}

