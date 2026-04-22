import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CreateNFTScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [voiceMemo, setVoiceMemo] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('digital_art');
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const handleTakePhoto = () => {
    // In production, this would open camera
    // For now, simulate with placeholder
    setPhoto('placeholder_photo_uri');
    setStep(2);
  };

  const handleRecordVoice = () => {
    if (recording) {
      setRecording(false);
      setVoiceMemo('recorded_voice_uri');
    } else {
      setRecording(true);
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setRecording(false);
        setVoiceMemo('recorded_voice_uri');
      }, 3000);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success!',
        'Your artwork has been saved. It will be uploaded when you have internet connection.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Take a Photo</Text>
            <Text style={styles.stepDescription}>
              Take a clear photo of your artwork. Make sure it's well-lit and shows all details.
            </Text>
            
            {photo ? (
              <View style={styles.photoPreview}>
                <MaterialIcons name="image" size={120} color="#8B4513" />
                <Text style={styles.previewText}>Photo captured!</Text>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => setPhoto(null)}
                >
                  <Text style={styles.retakeText}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handleTakePhoto}
              >
                <MaterialIcons name="camera-alt" size={64} color="#FFF" />
                <Text style={styles.cameraText}>Tap to Take Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 2: Record Voice Story</Text>
            <Text style={styles.stepDescription}>
              Tell the story of your piece. What does it mean? What materials did you use?
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.recordButton,
                recording && styles.recordingActive
              ]}
              onPress={handleRecordVoice}
            >
              <MaterialIcons 
                name={recording ? "stop" : "mic"} 
                size={64} 
                color="#FFF" 
              />
              <Text style={styles.recordText}>
                {recording ? 'Recording... Tap to Stop' : 'Tap to Record'}
              </Text>
            </TouchableOpacity>

            {voiceMemo && !recording && (
              <View style={styles.voicePreview}>
                <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
                <Text style={styles.previewText}>Voice story recorded!</Text>
              </View>
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 3: Add Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title of Artwork</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your artwork..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type of Art</Text>
              <View style={styles.typeButtons}>
                {['digital_art', 'physical_art', 'music', 'textile'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeButton,
                      type === t && styles.typeButtonActive
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === t && styles.typeButtonTextActive
                    ]}>
                      {t.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 4: Set Price</Text>
            <Text style={styles.stepDescription}>
              How much would you like to sell this for? You can always change this later.
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

            <View style={styles.royaltyContainer}>
              <Text style={styles.royaltyLabel}>Ongoing Royalty: 10%</Text>
              <Text style={styles.royaltyDescription}>
                You'll receive 10% every time this is resold
              </Text>
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price:</Text>
                <Text style={styles.summaryValue}>{price || '0'} XRP</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>You receive:</Text>
                <Text style={styles.summaryValue}>
                  {price ? (parseFloat(price) * 0.92).toFixed(2) : '0'} XRP (92%)
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Artwork</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{step} / {totalSteps}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${(step / totalSteps) * 100}%` }
          ]} 
        />
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {step > 1 && (
          <TouchableOpacity 
            style={styles.navButtonSecondary}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.navButtonTextSecondary}>Back</Text>
          </TouchableOpacity>
        )}
        
        {step < totalSteps ? (
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.navButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.navButtonText}>Save Artwork</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  stepText: {
    color: '#FFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0D4C4',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B4513',
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  cameraButton: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  cameraText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  photoPreview: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  previewText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 16,
  },
  retakeButton: {
    marginTop: 16,
  },
  retakeText: {
    color: '#8B4513',
    fontSize: 16,
  },
  recordButton: {
    backgroundColor: '#8B4513',
    borderRadius: 100,
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  recordingActive: {
    backgroundColor: '#D32F2F',
  },
  recordText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  voicePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#3E2723',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0D4C4',
  },
  typeButtonActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  typeButtonText: {
    color: '#666',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginRight: 12,
  },
  priceInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  royaltyContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  royaltyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  royaltyDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  navButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 12,
  },
  navButtonSecondary: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navButtonTextSecondary: {
    color: '#8B4513',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
});
