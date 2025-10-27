import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { theme } from '../theme/colors';

const CalculatorsScreen = ({ navigation }) => {
  const calculators = [
    {
      id: 'fabric-converter',
      title: 'Fabric Measurement Converter',
      description: 'Convert between inches, yards, decimal and fractional measurements',
      icon: 'swap-horizontal',
      color: theme.colors.primary,
    },
    {
      id: 'backing-batting',
      title: 'Backing and Batting Calculator',
      description: 'Calculate material needed from fabric bolt for quilt backing',
      icon: 'layers',
      color: theme.colors.secondary,
    },
    {
      id: 'piece-count',
      title: 'Piece Count Calculator',
      description: 'Determine number of fixed-sized pieces from larger fabric',
      icon: 'grid',
      color: theme.colors.accent,
    },
    {
      id: 'pieces-to-area',
      title: 'Pieces to Area Calculator',
      description: 'Calculate fabric needed for specific number of pieces',
      icon: 'view-module',
      color: theme.colors.primary,
    },
    {
      id: 'binding',
      title: 'Binding Calculator',
      description: 'Calculate fabric required for quilt binding strips',
      icon: 'border-all',
      color: theme.colors.secondary,
    },
    {
      id: 'border',
      title: 'Border Calculator',
      description: 'Determine fabric needed for quilt borders',
      icon: 'border-outside',
      color: theme.colors.accent,
    },
    {
      id: 'square-in-square',
      title: 'Square-in-a-Square Calculator',
      description: 'Calculate key dimensions for square-in-a-square blocks',
      icon: 'square-outline',
      color: theme.colors.primary,
    },
    {
      id: 'triangles',
      title: 'Set-in and Corner Triangle Calculator',
      description: 'Calculate triangle cutting dimensions for blocks',
      icon: 'triangle-outline',
      color: theme.colors.secondary,
    },
  ];

  const handleCalculatorPress = (calculatorId) => {
    // TODO: Navigate to specific calculator screen
    console.log(`Opening calculator: ${calculatorId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {calculators.map((calculator) => (
          <Card key={calculator.id} style={styles.calculatorCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <IconButton
                  icon={calculator.icon}
                  size={32}
                  iconColor={calculator.color}
                  style={[styles.icon, { backgroundColor: `${calculator.color}20` }]}
                />
                <View style={styles.cardText}>
                  <Title style={styles.cardTitle}>{calculator.title}</Title>
                  <Paragraph style={styles.cardDescription}>
                    {calculator.description}
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="chevron-right"
                size={24}
                onPress={() => handleCalculatorPress(calculator.id)}
              />
            </Card.Actions>
          </Card>
        ))}
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
  calculatorCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  cardContent: {
    paddingBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.placeholder,
  },
});

export default CalculatorsScreen;