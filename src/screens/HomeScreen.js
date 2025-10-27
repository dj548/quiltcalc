import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { theme } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>Welcome to QuiltCalc</Title>
            <Paragraph style={styles.welcomeText}>
              Your complete quilting companion for calculations, fabric preview, and material shopping.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quilting Calculators</Title>
            <Paragraph>
              Access all 8 professional quilting calculators including fabric yardage, 
              backing, binding, borders, and specialized block calculations.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Calculators')}
              buttonColor={theme.colors.primary}
            >
              Open Calculators
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Fabric Preview</Title>
            <Paragraph>
              Upload a photo of your quilt and preview how different fabrics 
              will look with our virtual fabric fold feature.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('FabricPreview')}
              buttonColor={theme.colors.secondary}
            >
              Try Fabric Preview
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Materials List</Title>
            <Paragraph>
              Generate shopping lists from your calculations and send them 
              directly to Cotton Wood for easy ordering.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('MaterialsList')}
              buttonColor={theme.colors.accent}
            >
              View Materials
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="calculator"
        onPress={() => navigation.navigate('Calculators')}
        color="#fff"
        customSize={56}
      />
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
    paddingBottom: 100,
  },
  welcomeCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
  },
  featureCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.h4.fontSize,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HomeScreen;