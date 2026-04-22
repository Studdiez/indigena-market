import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Animated,
  Vibration
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const STEPS = [
  { id: 'photo', label: 'Take Photo', icon: 'camera-alt' },
  { id: 'voice', label: 'Tell Story', icon: 'mic' },
  { id: 'details', label: 'Add Details', icon: 'edit' },
  { id: 'price', label: 'Set Price', icon: 'attach-money' }
];

export default function VoiceFirstCreateScreen({ navigation, route }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));

  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If started with voice flag, jump to voice step after photo
    if (route.params?.startWithVoice && currentStep === 0) {
      setPhoto('placeholder');
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();

      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    }

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTakePhoto = () => {
    // Simulate taking photo
    setPhoto('captured_photo_uri');
    Vibration.vibrate(100);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceRecorded(true);
      Vibration.vibrate([0, 100, 50, 100]);
    } else {
      setIsRecording(true);
      Vibration.vibrate(50);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit
      navigation.navigate('Home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Photo
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Take a Photo of Your Art</Text>
            <Text style={styles.stepDescription}>
              Make sure it's in good light so everyone can see your beautiful work
            </Text>

            {!photo ? (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handleTakePhoto}
              >
                <MaterialIcons name="camera-alt" size={80} color="#FFF" />
                <Text style={styles.cameraButtonText}>Tap to Take Photo</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.photoPreview}>
                <View style={styles.photoPlaceholder}>
                  <MaterialIcons name="image" size={100} color="#8B4513" />
                </View>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => setPhoto(null)}
                >
                  <MaterialIcons name="refresh" size={24} color="#8B4513" />
                  <Text style={styles.retakeText}>Take Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 1: // Voice
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tell the Story</Text>
            <Text style={styles.stepDescription}>
              Speak from your heart. What does this piece mean? What materials did you use?
            </Text>

            <View style={styles.voiceContainer}>
              {!voiceRecorded ? (
                <>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity
                      style={[styles.recordButton, isRecording && styles.recordingButton]}
                      onPress={handleRecordToggle}
                    >
                      <MaterialIcons 
                        name={isRecording ? "stop" : "mic"} 
                        size={64} 
                        color="#FFF" 
                      />
                    </TouchableOpacity>
                  </Animated.View>

                  <Text style={styles.recordStatus}>
                    {isRecording ? 'Recording... Tap to Stop' : 'Tap to Start Recording'}
                  </Text>

                  {isRecording && (
                    <Text style={styles.recordTimer}>
                      {formatTime(recordingDuration)}
                    </Text>
                  )}
                </>
              ) : (
                <View style={styles.recordedContainer}>
                  <View style={styles.recordedIcon}>
                    <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
                  </View>
                  <Text style={styles.recordedText}>Story Recorded!</Text>
                  <Text style={styles.recordedDuration}>
                    {formatTime(recordingDuration)}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.reRecordButton}
                    onPress={() => {
                      setVoiceRecorded(false);
                      setRecordingDuration(0);
                    }}
                  >
                    <MaterialIcons name="refresh" size={20} color="#8B4513" />
                    <Text style={styles.reRecordText}>Record Again</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {voiceRecorded && (
              <View style={styles.tipsBox}>
                <MaterialIcons name="lightbulb" size={24} color="#DAA520" />
                <Text style={styles.tipsText}>
                  Great! Your voice makes this artwork special. No one else can tell this story.
                </Text>
              </View>
            )}
          </View>
        );

      case 2: // Details
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Name Your Artwork</Text>
            <Text style={styles.stepDescription}>
              Give it a name that feels right
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What do you call this piece?</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter the name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tell us more (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="What materials did you use? What inspired you?"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );

      case 3: // Price
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Set Your Price</Text>
            <Text style={styles.stepDescription}>
              How much would you like to sell this for?
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.currency}>XRP</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.earningsBox}>
              <Text style={styles.earningsTitle}>You will receive:</Text>
              <Text style={styles.earningsAmount}>
                {price ? (parseFloat(price) * 0.92).toFixed(2) : '0'} XRP
              </Text>
              <Text style={styles.earningsNote}>
                (92% - we take only 8% to keep the platform running)
              </Text>
            </View>

            <View style={styles.royaltyBox}>
              <MaterialIcons name="repeat" size={24} color="#4CAF50" />
              <Text style={styles.royaltyText}>
                Plus 10% every time this is resold. Forever.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!photo;
      case 1: return voiceRecorded;
      case 2: return title.length > 0;
      case 3: return price.length > 0 && parseFloat(price) > 0;
      default: return false;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={32} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Your Art</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{currentStep + 1} of {STEPS.length}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {STEPS.map((step, index) => (
          <View key={step.id} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              index <= currentStep ? styles.progressDotActive : null
            ]}>
              <MaterialIcons 
                name={step.icon as any} 
                size={16} 
                color={index <= currentStep ? '#FFF' : '#999'} 
              />
            </View>
            <Text style={[
              styles.progressLabel,
              index <= currentStep ? styles.progressLabelActive : null
            ]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {renderStep()}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === STEPS.length - 1 ? 'Share My Art' : 'Continue'}
          </Text>
          <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Brand colors
const BRAND_RED = '#B91C1C';
const BRAND_RED_DARK = '#7F1D1D';
const BRAND_RED_LIGHT = '#FEE2E2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2F2',  // Light brand red
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  stepIndicator: {
    backgroundColor: BRAND_RED,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D4C4',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0D4C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: BRAND_RED,
  },
  progressLabel: {
    fontSize: 12,
    color: '#999',
  },
  progressLabelActive: {
    color: BRAND_RED,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  cameraButton: {
    backgroundColor: BRAND_RED,
    borderRadius: 30,
    padding: 60,
    alignItems: 'center',
    alignSelf: 'center',
  },
  cameraButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retakeText: {
    color: BRAND_RED,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  voiceContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  recordButton: {
    width: 140,
    height: 140,
    backgroundColor: BRAND_RED,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: '#D32F2F',
  },
  recordStatus: {
    fontSize: 18,
    color: '#666',
    marginTop: 24,
    fontWeight: '500',
  },
  recordTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: BRAND_RED,
    marginTop: 16,
  },
  recordedContainer: {
    alignItems: 'center',
  },
  recordedIcon: {
    marginBottom: 16,
  },
  recordedText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  recordedDuration: {
    fontSize: 24,
    color: '#666',
    marginTop: 8,
  },
  reRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
  },
  reRecordText: {
    color: BRAND_RED,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8DC',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  tipsText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    fontSize: 20,
    color: '#3E2723',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  currency: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND_RED,
    marginRight: 16,
  },
  priceInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  earningsBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  earningsNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  royaltyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  royaltyText: {
    flex: 1,
    fontSize: 16,
    color: '#3E2723',
    marginLeft: 12,
  },
  bottomContainer: {
    padding: 24,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0D4C4',
  },
  nextButton: {
    backgroundColor: BRAND_RED,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
