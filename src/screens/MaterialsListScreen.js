import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, List, IconButton, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';

const MaterialsListScreen = () => {
  const [materialsList, setMaterialsList] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    loadMaterialsList();
  }, []);

  const loadMaterialsList = async () => {
    try {
      const stored = await AsyncStorage.getItem('materialsList');
      if (stored) {
        const materials = JSON.parse(stored);
        setMaterialsList(materials);
        calculateTotal(materials);
      } else {
        // Demo data for development
        const demoMaterials = [
          {
            id: '1',
            name: 'Cotton Fabric - Blue Floral',
            quantity: '2.5 yards',
            price: 12.99,
            category: 'Fabric',
          },
          {
            id: '2',
            name: 'Batting - Queen Size',
            quantity: '1 piece',
            price: 24.99,
            category: 'Batting',
          },
          {
            id: '3',
            name: 'Thread - Quilting Cotton',
            quantity: '3 spools',
            price: 8.99,
            category: 'Thread',
          },
        ];
        setMaterialsList(demoMaterials);
        calculateTotal(demoMaterials);
      }
    } catch (error) {
      console.error('Error loading materials list:', error);
    }
  };

  const calculateTotal = (materials) => {
    const total = materials.reduce((sum, item) => sum + item.price, 0);
    setTotalCost(total);
  };

  const removeMaterial = async (id) => {
    const updatedList = materialsList.filter(item => item.id !== id);
    setMaterialsList(updatedList);
    calculateTotal(updatedList);
    
    try {
      await AsyncStorage.setItem('materialsList', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error saving materials list:', error);
    }
  };

  const sendToCottonWood = () => {
    Alert.alert(
      'Send to Cotton Wood',
      'Your materials list will be sent to Cotton Wood for processing. You will receive a confirmation email shortly.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            // TODO: Implement actual API call to Cotton Wood
            Alert.alert('Success', 'Your materials list has been sent to Cotton Wood!');
          }
        },
      ]
    );
  };

  const clearList = () => {
    Alert.alert(
      'Clear List',
      'Are you sure you want to clear your entire materials list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            setMaterialsList([]);
            setTotalCost(0);
            try {
              await AsyncStorage.removeItem('materialsList');
            } catch (error) {
              console.error('Error clearing materials list:', error);
            }
          }
        },
      ]
    );
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'fabric': return 'texture';
      case 'batting': return 'layers';
      case 'thread': return 'cached';
      default: return 'package-variant';
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'fabric': return theme.colors.primary;
      case 'batting': return theme.colors.secondary;
      case 'thread': return theme.colors.accent;
      default: return theme.colors.placeholder;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Materials Summary</Title>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items:</Text>
              <Text style={styles.summaryValue}>{materialsList.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Total:</Text>
              <Text style={styles.summaryValue}>${totalCost.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.materialsCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Your Materials</Title>
              {materialsList.length > 0 && (
                <IconButton
                  icon="delete"
                  size={24}
                  onPress={clearList}
                  iconColor={theme.colors.error}
                />
              )}
            </View>
            
            {materialsList.length === 0 ? (
              <Text style={styles.emptyText}>
                No materials in your list yet. Add items from calculators or fabric preview.
              </Text>
            ) : (
              materialsList.map((item, index) => (
                <View key={item.id}>
                  <List.Item
                    title={item.name}
                    description={`${item.quantity} - $${item.price.toFixed(2)}`}
                    left={() => (
                      <List.Icon 
                        icon={getCategoryIcon(item.category)} 
                        color={getCategoryColor(item.category)}
                      />
                    )}
                    right={() => (
                      <IconButton
                        icon="close"
                        size={20}
                        onPress={() => removeMaterial(item.id)}
                        iconColor={theme.colors.error}
                      />
                    )}
                  />
                  {index < materialsList.length - 1 && <Divider />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {materialsList.length > 0 && (
          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Next Steps</Title>
              <Text style={styles.actionText}>
                Send your materials list to Cotton Wood for easy ordering and availability check.
              </Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                onPress={sendToCottonWood}
                buttonColor={theme.colors.primary}
                style={styles.sendButton}
                icon="send"
              >
                Send to Cotton Wood
              </Button>
            </Card.Actions>
          </Card>
        )}
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
  summaryCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  summaryValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  materialsCard: {
    marginBottom: theme.spacing.md,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    fontStyle: 'italic',
  },
  actionsCard: {
    elevation: 2,
  },
  actionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardActions: {
    justifyContent: 'center',
  },
  sendButton: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
});

export default MaterialsListScreen;