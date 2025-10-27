import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Card, Title, Button, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/colors';

const FabricPreviewScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const previewFabrics = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first.');
      return;
    }
    
    setIsLoading(true);
    // TODO: Implement fabric preview logic
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Coming Soon', 'Fabric preview feature will be available in the next update!');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.instructionCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>How it Works</Title>
            <Text style={styles.instructionText}>
              1. Take a photo of your quilt or upload from gallery{'\n'}
              2. Browse Cotton Wood fabrics{'\n'}
              3. See how fabrics look with virtual fold preview{'\n'}
              4. Add matching fabrics to your materials list
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.uploadCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Upload Your Quilt Photo</Title>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <Text style={styles.imageText}>Photo selected successfully!</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>
                No photo selected. Choose from gallery or take a new photo.
              </Text>
            )}
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.actionButton}
              buttonColor={theme.colors.surface}
            >
              Choose from Gallery
            </Button>
            <Button
              mode="outlined"
              onPress={takePhoto}
              style={styles.actionButton}
              buttonColor={theme.colors.surface}
            >
              Take Photo
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.previewCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Fabric Preview</Title>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Processing your image...</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>
                Upload a photo to start previewing fabrics from Cotton Wood's collection.
              </Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={previewFabrics}
              disabled={!selectedImage || isLoading}
              buttonColor={theme.colors.primary}
              style={styles.previewButton}
            >
              {isLoading ? 'Processing...' : 'Preview Fabrics'}
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  instructionCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  uploadCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  previewCard: {
    elevation: 2,
  },
  cardTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  instructionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  imageText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  placeholderText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  cardActions: {
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.placeholder,
  },
  previewButton: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
});

export default FabricPreviewScreen;