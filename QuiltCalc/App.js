import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, Image, Dimensions, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Provider as PaperProvider, Card, Title, Text, TextInput, Button, SegmentedButtons, IconButton, Menu } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Svg, { Rect, Line, Text as SvgText, Path, Defs, Pattern, ClipPath, G, LinearGradient, Stop } from 'react-native-svg';

const theme = {
  colors: {
    primary: '#5DADE2',      // Cottonwood Blue (primary)
    primaryDark: '#3498DB',  // Darker blue
    primaryLight: '#85C1E9', // Lighter blue
    secondary: '#4A9FD8',    // Darker blue
    accent: '#FF8C69',       // Cottonwood Orange (accent)
    accentGreen: '#A5D66C',  // Cottonwood Green (accent)
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient background
    backgroundSolid: '#F8F9FA', // Light gray background
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    placeholder: '#7F8C8D',
    error: '#D32F2F',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Fractional Input Component with up/down arrows
const FractionalInput = ({ label, value, onChange, style }) => {
  const [wholeNumber, setWholeNumber] = useState('48');
  const [fractionIndex, setFractionIndex] = useState(0);

  const fractions = [
    { label: '0', value: 0 },
    { label: '⅛', value: 0.125 },
    { label: '¼', value: 0.25 },
    { label: '⅜', value: 0.375 },
    { label: '½', value: 0.5 },
    { label: '⅝', value: 0.625 },
    { label: '¾', value: 0.75 },
    { label: '⅞', value: 0.875 },
  ];

  useEffect(() => {
    const val = parseFloat(value) || 0;
    const whole = Math.floor(val);
    const frac = val - whole;
    setWholeNumber(whole.toString());

    // Find closest fraction
    const closestIndex = fractions.reduce((prevIdx, curr, idx) => {
      return Math.abs(curr.value - frac) < Math.abs(fractions[prevIdx].value - frac) ? idx : prevIdx;
    }, 0);
    setFractionIndex(closestIndex);
  }, []);

  const updateValue = (newWhole, newFractionIdx) => {
    const total = parseFloat(newWhole || 0) + fractions[newFractionIdx].value;
    onChange(total.toString());
  };

  const increment = () => {
    const newWhole = Math.min(999, (parseInt(wholeNumber) || 0) + 1);
    setWholeNumber(newWhole.toString());
    updateValue(newWhole, fractionIndex);
  };

  const decrement = () => {
    const newWhole = Math.max(0, (parseInt(wholeNumber) || 0) - 1);
    setWholeNumber(newWhole.toString());
    updateValue(newWhole, fractionIndex);
  };

  const handleWholeChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 3);
    setWholeNumber(cleaned);
    updateValue(cleaned, fractionIndex);
  };

  const cycleFraction = () => {
    const newIndex = (fractionIndex + 1) % fractions.length;
    setFractionIndex(newIndex);
    updateValue(wholeNumber, newIndex);
  };

  return (
    <View style={[styles.fractionalInputContainer, style]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <View style={styles.wholeNumberContainer}>
          <View style={styles.arrowButtons}>
            <IconButton
              icon="chevron-up"
              size={20}
              onPress={increment}
              style={styles.arrowButton}
              iconColor={theme.colors.primary}
            />
          </View>
          <TextInput
            mode="outlined"
            value={wholeNumber}
            onChangeText={handleWholeChange}
            keyboardType="numeric"
            style={styles.wholeNumberInput}
            maxLength={3}
          />
          <View style={styles.arrowButtons}>
            <IconButton
              icon="chevron-down"
              size={20}
              onPress={decrement}
              style={styles.arrowButton}
              iconColor={theme.colors.primary}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.fractionButton}
          onPress={cycleFraction}
        >
          <Text style={styles.fractionButtonText}>{fractions[fractionIndex].label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Draggable Input Container
const DraggableInput = ({ children, initialX, initialY, style, stepNumber, shouldPulse }) => {
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  // Pulse animation
  useEffect(() => {
    if (shouldPulse) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [shouldPulse]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: pulseAnim },
          ],
          cursor: 'grab',
        },
      ]}
      {...panResponder.panHandlers}
    >
      {stepNumber && (
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{stepNumber}</Text>
        </View>
      )}
      <View style={styles.dragHandle}>
        <IconButton icon="drag" size={16} iconColor={theme.colors.textLight} />
      </View>
      {children}
    </Animated.View>
  );
};

// Number Input with up/down arrows
const NumberInput = ({ label, value, onChange, style, step = 1, allowDecimal = true, maxDigits = 3 }) => {
  const increment = () => {
    const newValue = (parseFloat(value) || 0) + step;
    onChange(newValue.toString());
  };

  const decrement = () => {
    const newValue = Math.max(0, (parseFloat(value) || 0) - step);
    onChange(newValue.toString());
  };

  const handleChange = (text) => {
    const cleaned = allowDecimal ? text.replace(/[^0-9.]/g, '') : text.replace(/[^0-9]/g, '');
    onChange(cleaned);
  };

  return (
    <View style={[styles.numberInputContainer, style]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.numberInputRow}>
        <TextInput
          mode="outlined"
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          style={[styles.numberInput, maxDigits === 2 && styles.numberInputNarrow]}
          maxLength={maxDigits}
        />
        <View style={styles.arrowButtons}>
          <IconButton
            icon="chevron-up"
            size={24}
            onPress={increment}
            style={styles.arrowButtonLarge}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="chevron-down"
            size={24}
            onPress={decrement}
            style={styles.arrowButtonLarge}
            iconColor={theme.colors.primary}
          />
        </View>
      </View>
    </View>
  );
};

// Dynamic Quilt Diagram Component
const QuiltDiagram = ({ quiltWidth, quiltLength, battingWidth, battingLength, backingOrientation, backingFabricWidth, backingPieces, extraWidth }) => {
  const diagramWidth = 450;
  const diagramHeight = 450;
  const padding = 60;

  const width = parseFloat(quiltWidth) || 48;
  const length = parseFloat(quiltLength) || 48;
  const battingW = parseFloat(battingWidth) || width + 6;
  const battingL = parseFloat(battingLength) || length + 6;
  const extra = parseFloat(extraWidth) || 3;

  // Calculate scale to fit diagram
  const maxDimension = Math.max(battingW, battingL);
  const scale = (diagramWidth - padding * 2) / maxDimension;

  const quiltW = width * scale;
  const quiltH = length * scale;
  const battW = battingW * scale;
  const battH = battingL * scale;

  // Left justify the diagram vertically centered
  const battingX = padding;
  const battingY = (diagramHeight - battH) / 2;
  const quiltX = battingX + (battW - quiltW) / 2;
  const quiltY = battingY + (battH - quiltH) / 2;

  // Generate quilting pattern lines
  const gridSize = 25;
  const quiltLines = [];

  // Diagonal lines going one direction
  for (let i = -quiltH; i < quiltW + quiltH; i += gridSize) {
    quiltLines.push(
      <Line
        key={`diag1-${i}`}
        x1={quiltX + i}
        y1={quiltY}
        x2={quiltX + i + quiltH}
        y2={quiltY + quiltH}
        stroke="#FFB380"
        strokeWidth="1.5"
        opacity="0.4"
      />
    );
  }

  // Diagonal lines going the other direction
  for (let i = 0; i < quiltW + quiltH; i += gridSize) {
    quiltLines.push(
      <Line
        key={`diag2-${i}`}
        x1={quiltX + i}
        y1={quiltY}
        x2={quiltX + i - quiltH}
        y2={quiltY + quiltH}
        stroke="#FFB380"
        strokeWidth="1.5"
        opacity="0.4"
      />
    );
  }

  return (
    <Svg width={diagramWidth} height={diagramHeight} viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}>
      {/* Define gradients and clip path */}
      <Defs>
        <ClipPath id="quiltClip">
          <Rect
            x={quiltX}
            y={quiltY}
            width={quiltW}
            height={quiltH}
          />
        </ClipPath>
        <LinearGradient id="battingGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D6EAF8" stopOpacity="1" />
          <Stop offset="1" stopColor="#AED6F1" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="quiltGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFEAD0" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFD7A8" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Batting/Backing with shadow effect */}
      <Rect
        x={battingX + 4}
        y={battingY + 4}
        width={battW}
        height={battH}
        fill="#000"
        opacity="0.1"
        rx="8"
      />
      {/* Batting/Backing with gradient */}
      <Rect
        x={battingX}
        y={battingY}
        width={battW}
        height={battH}
        fill="url(#battingGradient)"
        stroke={theme.colors.primary}
        strokeWidth="3"
        strokeDasharray="10,5"
        rx="8"
      />

      {/* Quilt top shadow */}
      <Rect
        x={quiltX + 3}
        y={quiltY + 3}
        width={quiltW}
        height={quiltH}
        fill="#000"
        opacity="0.15"
        rx="4"
      />

      {/* Quilt top background with gradient */}
      <Rect
        x={quiltX}
        y={quiltY}
        width={quiltW}
        height={quiltH}
        fill="url(#quiltGradient)"
        stroke="none"
        rx="4"
      />

      {/* Quilting pattern lines - clipped to quilt boundaries */}
      <G clipPath="url(#quiltClip)">
        {quiltLines}
      </G>

      {/* Quilt top border with glow effect */}
      <Rect
        x={quiltX}
        y={quiltY}
        width={quiltW}
        height={quiltH}
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth="5"
        rx="4"
      />
      <Rect
        x={quiltX}
        y={quiltY}
        width={quiltW}
        height={quiltH}
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth="2"
        opacity="0.5"
        rx="4"
      />

      {/* Quilt dimensions inside the quilt box */}
      <SvgText
        x={quiltX + quiltW / 2}
        y={quiltY + quiltH / 2 - 15}
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill={theme.colors.accent}
      >
        {width}" wide
      </SvgText>
      <SvgText
        x={quiltX + quiltW / 2}
        y={quiltY + quiltH / 2 + 5}
        textAnchor="middle"
        fontSize="14"
        fill={theme.colors.accent}
      >
        ×
      </SvgText>
      <SvgText
        x={quiltX + quiltW / 2}
        y={quiltY + quiltH / 2 + 25}
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill={theme.colors.accent}
      >
        {length}" tall
      </SvgText>

      {/* Extra width annotation lines */}
      <Line
        x1={quiltX}
        y1={quiltY - 5}
        x2={battingX}
        y2={battingY - 5}
        stroke={theme.colors.accentGreen}
        strokeWidth="2"
        strokeDasharray="3,3"
      />
      <Line
        x1={quiltX + quiltW}
        y1={quiltY - 5}
        x2={battingX + battW}
        y2={battingY - 5}
        stroke={theme.colors.accentGreen}
        strokeWidth="2"
        strokeDasharray="3,3"
      />
      <SvgText
        x={(quiltX + battingX) / 2}
        y={battingY - 10}
        textAnchor="middle"
        fontSize="12"
        fill={theme.colors.accentGreen}
      >
        {extra}"
      </SvgText>
      <SvgText
        x={(quiltX + quiltW + battingX + battW) / 2}
        y={battingY - 10}
        textAnchor="middle"
        fontSize="12"
        fill={theme.colors.accentGreen}
      >
        {extra}"
      </SvgText>

      {/* Batting/Backing dimension labels (text only, no lines) */}
      <SvgText
        x={battingX + battW / 2}
        y={battingY + battH + 30}
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill={theme.colors.primary}
      >
        {battingW.toFixed(1)}"
      </SvgText>

      <SvgText
        x={battingX + battW + 30}
        y={battingY + battH / 2}
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill={theme.colors.primary}
        transform={`rotate(90, ${battingX + battW + 30}, ${battingY + battH / 2})`}
      >
        {battingL.toFixed(1)}"
      </SvgText>

      {/* Piecing seams - drawn on top with glow effect */}
      {backingOrientation === 'vertical' && backingPieces > 1 && (
        <>
          {Array.from({ length: backingPieces - 1 }, (_, i) => {
            const seamX = battingX + (battW / backingPieces) * (i + 1);
            return (
              <G key={`vertical-seam-${i}`}>
                {/* Glow effect */}
                <Line
                  x1={seamX}
                  y1={battingY}
                  x2={seamX}
                  y2={battingY + battH}
                  stroke={theme.colors.accentGreen}
                  strokeWidth="6"
                  strokeDasharray="8,5"
                  opacity="0.3"
                />
                {/* Main seam line */}
                <Line
                  x1={seamX}
                  y1={battingY}
                  x2={seamX}
                  y2={battingY + battH}
                  stroke={theme.colors.accentGreen}
                  strokeWidth="3"
                  strokeDasharray="8,5"
                />
              </G>
            );
          })}
        </>
      )}

      {backingOrientation === 'horizontal' && backingPieces > 1 && (
        <>
          {Array.from({ length: backingPieces - 1 }, (_, i) => {
            const seamY = battingY + (battH / backingPieces) * (i + 1);
            return (
              <G key={`horizontal-seam-${i}`}>
                {/* Glow effect */}
                <Line
                  x1={battingX}
                  y1={seamY}
                  x2={battingX + battW}
                  y2={seamY}
                  stroke={theme.colors.accentGreen}
                  strokeWidth="6"
                  strokeDasharray="8,5"
                  opacity="0.3"
                />
                {/* Main seam line */}
                <Line
                  x1={battingX}
                  y1={seamY}
                  x2={battingX + battW}
                  y2={seamY}
                  stroke={theme.colors.accentGreen}
                  strokeWidth="3"
                  strokeDasharray="8,5"
                />
              </G>
            );
          })}
        </>
      )}
    </Svg>
  );
};

// Function to find the recommended batting size to buy
const getBattingSize = (width, height) => {
  const battingSizes = [
    { name: 'Crib', width: 45, height: 60 },
    { name: 'Throw', width: 60, height: 72 },
    { name: 'Twin', width: 72, height: 90 },
    { name: 'Full/Double', width: 81, height: 96 },
    { name: 'Queen', width: 90, height: 108 },
    { name: 'King', width: 120, height: 120 },
  ];

  // Find the smallest batting that fits
  for (const size of battingSizes) {
    if (width <= size.width && height <= size.height) {
      return size;
    }
    // Also check rotated
    if (width <= size.height && height <= size.width) {
      return { ...size, rotated: true };
    }
  }

  // If nothing fits, return custom size
  return { name: 'Custom', width: Math.ceil(width), height: Math.ceil(height) };
};

export default function App() {
  const [quiltWidth, setQuiltWidth] = useState('48');
  const [quiltLength, setQuiltLength] = useState('48');
  const [extraWidth, setExtraWidth] = useState('3');
  const [fabricWidth, setFabricWidth] = useState('43');
  const [backingFabricWidth, setBackingFabricWidth] = useState('43');
  const [backingOrientation, setBackingOrientation] = useState('vertical');
  const [backingType, setBackingType] = useState('standard'); // 'standard' or 'wideback'
  const [bindingWidth, setBindingWidth] = useState('1.5');
  const [results, setResults] = useState(null);
  const [shouldPulse, setShouldPulse] = useState(true);

  // Mobile detection
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const isMobile = windowDimensions.width < 768;
  const isSmallMobile = windowDimensions.width < 480;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const calculate = () => {
    const width = parseFloat(quiltWidth);
    const length = parseFloat(quiltLength);
    const extra = parseFloat(extraWidth);
    const fabWidth = parseFloat(fabricWidth);
    const backingFabWidth = backingType === 'wideback' ? 108 : parseFloat(backingFabricWidth);

    if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) {
      setResults({ error: 'Please enter valid quilt dimensions' });
      return;
    }

    // Calculate batting size (add extra on all sides)
    const battingWidth = width + (extra * 2);
    const battingLength = length + (extra * 2);

    // Get recommended batting size to buy
    const battingToBuy = getBattingSize(battingWidth, battingLength);

    // Calculate backing size (same as batting)
    const backingWidth = battingWidth;
    const backingLength = battingLength;

    let backingYards = 0;
    let backingLayout = '';
    let backingPiecing = '';
    let backingPieces = 1;

    // Check if fabric width fits the backing
    if (backingOrientation === 'vertical') {
      // Vertical piecing - fabric runs along the length
      if (backingWidth <= backingFabWidth) {
        // Single width is sufficient
        backingYards = backingLength / 36;
        backingLayout = 'Single vertical panel';
        backingPiecing = 'No piecing required';
        backingPieces = 1;
      } else {
        // Need to piece - two or three vertical panels
        const panelsNeeded = Math.ceil(backingWidth / backingFabWidth);
        backingYards = (backingLength * panelsNeeded) / 36;
        backingLayout = `${panelsNeeded} vertical panels`;
        backingPiecing = `${panelsNeeded - 1} vertical seam(s)`;
        backingPieces = panelsNeeded;
      }
    } else {
      // Horizontal piecing - fabric runs along the width
      if (backingLength <= backingFabWidth) {
        // Single width is sufficient
        backingYards = backingWidth / 36;
        backingLayout = 'Single horizontal panel';
        backingPiecing = 'No piecing required';
        backingPieces = 1;
      } else {
        // Need to piece - two or three horizontal panels
        const panelsNeeded = Math.ceil(backingLength / backingFabWidth);
        backingYards = (backingWidth * panelsNeeded) / 36;
        backingLayout = `${panelsNeeded} horizontal panels`;
        backingPiecing = `${panelsNeeded - 1} horizontal seam(s)`;
        backingPieces = panelsNeeded;
      }
    }

    // Round backing yards up to nearest 1/4 yard
    backingYards = Math.ceil(backingYards * 4) / 4;

    // Calculate binding
    const bindingW = parseFloat(bindingWidth) || 1.5;
    const battingPerimeter = 2 * (battingWidth + battingLength);
    const bindingLengthNeeded = battingPerimeter + 10; // Add 10" for joining

    // Calculate how many strips needed
    const usableWidth = fabWidth - 1; // Account for selvage
    const stripsNeeded = Math.ceil(bindingLengthNeeded / usableWidth);
    const bindingFabricInches = stripsNeeded * bindingW;
    const bindingYards = bindingFabricInches / 36;

    // Round up to nearest 1/4 yard
    const bindingYardsRounded = Math.ceil(bindingYards * 4) / 4;

    setResults({
      battingWidth: battingWidth.toFixed(1),
      battingLength: battingLength.toFixed(1),
      battingToBuy,
      backingWidth: backingWidth.toFixed(1),
      backingLength: backingLength.toFixed(1),
      backingYards: backingYards.toFixed(2),
      backingLayout,
      backingPiecing,
      backingPieces,
      backingFabricWidth: backingFabWidth,
      bindingYards: bindingYardsRounded.toFixed(2),
      bindingStrips: stripsNeeded,
    });
  };

  // Auto-calculate when values change
  useEffect(() => {
    calculate();
  }, [quiltWidth, quiltLength, extraWidth, fabricWidth, backingFabricWidth, backingOrientation, backingType, bindingWidth]);

  const clear = () => {
    setQuiltWidth('48');
    setQuiltLength('48');
    setExtraWidth('3');
    setFabricWidth('43');
    setBackingFabricWidth('43');
    setBackingOrientation('vertical');
    setBackingType('standard');
    setBindingWidth('1.5');
    setResults(null);
    setShouldPulse(true);
    setTimeout(() => setShouldPulse(false), 3000);
  };

  // Stop pulsing after initial load
  useEffect(() => {
    const timer = setTimeout(() => setShouldPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView
          contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}
          showsVerticalScrollIndicator={false}
          style={Platform.OS === 'web' ? { height: '100vh' } : {}}
        >
          {/* Main Container Card */}
          <View style={[styles.mainContainer, isMobile && styles.mainContainerMobile]}>
            {/* Header with Logo */}
            <View style={[styles.header, isMobile && styles.headerMobile]}>
              <Image
                source={require('./assets/CW.png')}
                style={[styles.logo, isMobile && styles.logoMobile]}
                resizeMode="contain"
              />
              <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>Quilt Calculator</Text>
              <IconButton
                icon="refresh"
                size={24}
                onPress={clear}
                style={styles.headerResetButton}
                iconColor={theme.colors.primary}
                mode="contained-tonal"
              />
            </View>

            {/* Main Content Area - Settings Left, Diagram Right */}
            <View style={[styles.topSection, isMobile && styles.topSectionMobile]}>
              {/* Left Side - Settings Panel */}
              <View style={[styles.settingsPanel, isMobile && styles.settingsPanelMobile]}>
                <View style={styles.settingsGrid}>
                  {/* Extra Width */}
                  <NumberInput
                    label="Extra Width (each side)"
                    value={extraWidth}
                    onChange={setExtraWidth}
                    maxDigits={2}
                  />

                  {/* Backing Type */}
                  <View style={styles.settingSection}>
                    <Text style={styles.compactLabel}>Backing Fabric Type</Text>
                    <SegmentedButtons
                      value={backingType}
                      onValueChange={setBackingType}
                      buttons={[
                        { value: 'standard', label: 'Standard' },
                        { value: 'wideback', label: 'Wideback (108")' },
                      ]}
                      style={styles.compactSegmented}
                      theme={{
                        colors: {
                          secondaryContainer: theme.colors.primary,
                          onSecondaryContainer: '#FFFFFF',
                        }
                      }}
                    />
                  </View>

                  {/* Backing Fabric Width + Orientation - only show for standard */}
                  {backingType === 'standard' && (
                    <View style={styles.inlineInputGroup}>
                      <View style={{ flex: 1 }}>
                        <NumberInput
                          label="Backing Fabric Width (in)"
                          value={backingFabricWidth}
                          onChange={setBackingFabricWidth}
                          step={1}
                          allowDecimal={false}
                          maxDigits={3}
                        />
                      </View>
                      <View style={styles.orientationButtons}>
                        <Text style={styles.compactLabel}>Orientation</Text>
                        <View style={styles.iconButtonGroup}>
                          <IconButton
                            icon="swap-vertical"
                            size={24}
                            mode={backingOrientation === 'vertical' ? 'contained' : 'outlined'}
                            selected={backingOrientation === 'vertical'}
                            onPress={() => setBackingOrientation('vertical')}
                            iconColor={backingOrientation === 'vertical' ? '#FFFFFF' : theme.colors.primary}
                            containerColor={backingOrientation === 'vertical' ? theme.colors.primary : 'transparent'}
                            style={styles.orientationIconButton}
                          />
                          <IconButton
                            icon="swap-horizontal"
                            size={24}
                            mode={backingOrientation === 'horizontal' ? 'contained' : 'outlined'}
                            selected={backingOrientation === 'horizontal'}
                            onPress={() => setBackingOrientation('horizontal')}
                            iconColor={backingOrientation === 'horizontal' ? '#FFFFFF' : theme.colors.primary}
                            containerColor={backingOrientation === 'horizontal' ? theme.colors.primary : 'transparent'}
                            style={styles.orientationIconButton}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Binding Fabric Width + Binding Width */}
                  <View style={styles.inlineInputGroup}>
                    <View style={{ flex: 1 }}>
                      <NumberInput
                        label="Binding Fabric Width (in)"
                        value={fabricWidth}
                        onChange={setFabricWidth}
                        maxDigits={3}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <NumberInput
                        label="Binding Width (in)"
                        value={bindingWidth}
                        onChange={setBindingWidth}
                        step={0.25}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Right Side - Diagram */}
              <View style={styles.diagramArea}>
                <View style={[styles.diagramContainer, {
                  width: isMobile ? windowDimensions.width - 32 : Math.max(450, (parseFloat(results?.battingWidth || 50) * 5) * 1.25),
                  maxWidth: isMobile ? windowDimensions.width - 32 : 800,
                }, isMobile && styles.diagramContainerMobile]}>
                  {/* Diagram */}
                  <QuiltDiagram
                    quiltWidth={quiltWidth}
                    quiltLength={quiltLength}
                    battingWidth={results?.battingWidth}
                    battingLength={results?.battingLength}
                    backingOrientation={backingOrientation}
                    backingFabricWidth={results?.backingFabricWidth}
                    backingPieces={results?.backingPieces || 1}
                    extraWidth={extraWidth}
                  />

                  {/* Legend - Bottom of Diagram */}
                  <View style={styles.diagramLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: '#FFF5E6', borderColor: theme.colors.accent, borderWidth: 2 }]} />
                      <Text style={styles.legendText}>Quilt Top</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: '#E3F2FD', borderColor: theme.colors.primary, borderWidth: 2, borderStyle: 'dashed' }]} />
                      <Text style={styles.legendText}>Batting/Backing</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: 'transparent', borderColor: theme.colors.accentGreen, borderWidth: 2, borderStyle: 'dashed' }]} />
                      <Text style={styles.legendText}>Seams</Text>
                    </View>
                  </View>

                  {/* Floating Length Input - positioned just outside right edge of diagram container */}
                  <DraggableInput
                    initialX={0}
                    initialY={0}
                    style={styles.floatingLengthInput}
                    stepNumber={2}
                    shouldPulse={shouldPulse}
                  >
                    <FractionalInput
                      label="Quilt Length (inches)"
                      value={quiltLength}
                      onChange={setQuiltLength}
                    />
                  </DraggableInput>
                </View>

                {/* Floating Width Input */}
                <DraggableInput
                  initialX={0}
                  initialY={0}
                  style={styles.floatingWidthInput}
                  stepNumber={1}
                  shouldPulse={shouldPulse}
                >
                  <FractionalInput
                    label="Quilt Width (inches)"
                    value={quiltWidth}
                    onChange={setQuiltWidth}
                  />
                </DraggableInput>
              </View>
            </View>

          {/* Results Section - Horizontal Compact Cards */}
          {results && (
            <>
              {results.error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{results.error}</Text>
                </View>
              ) : (
                <View style={styles.resultsRow}>
                  {/* Batting Card */}
                  <View style={styles.resultCardCompact}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultTitleCompact}>Batting</Text>
                    </View>
                    <View style={styles.resultBody}>
                      <View style={styles.resultItem}>
                        <Text style={styles.resultValueCompact}>
                          {results.battingWidth}" × {results.battingLength}" Size
                        </Text>
                      </View>
                      <View style={styles.highlightBox}>
                        <Text style={styles.highlightLabelCompact}>Buy</Text>
                        <Text style={styles.highlightValueCompact}>
                          {results.battingToBuy.name}
                        </Text>
                        {results.battingToBuy.name !== 'Custom' && (
                          <Text style={styles.highlightSubtext}>
                            {results.battingToBuy.width}" × {results.battingToBuy.height}"
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Backing Card */}
                  <View style={styles.resultCardCompact}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultTitleCompact}>Backing</Text>
                    </View>
                    <View style={styles.resultBody}>
                      <View style={styles.resultItem}>
                        <Text style={styles.resultLabelCompact}>Size / Layout</Text>
                        <Text style={styles.resultValueCompact}>
                          {results.backingWidth}" × {results.backingLength}"
                        </Text>
                        <Text style={styles.resultSubtext}>{results.backingLayout}</Text>
                      </View>
                      <View style={styles.highlightBox}>
                        <View style={styles.fabricRow}>
                          <Text style={styles.highlightLabelCompact}>Fabric</Text>
                          <Text style={styles.incrementText}>¼ yard increments</Text>
                        </View>
                        <Text style={styles.highlightValueCompact}>{results.backingYards} yds</Text>
                      </View>
                    </View>
                  </View>

                  {/* Binding Card */}
                  <View style={styles.resultCardCompact}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultTitleCompact}>Binding</Text>
                    </View>
                    <View style={styles.resultBody}>
                      <View style={styles.resultItem}>
                        <Text style={styles.resultLabelCompact}>Strip Width / Count</Text>
                        <Text style={styles.resultValueCompact}>{bindingWidth}" wide</Text>
                        <Text style={styles.resultSubtext}>{results.bindingStrips} strips needed</Text>
                      </View>
                      <View style={styles.highlightBox}>
                        <View style={styles.fabricRow}>
                          <Text style={styles.highlightLabelCompact}>Fabric</Text>
                          <Text style={styles.incrementText}>¼ yard increments</Text>
                        </View>
                        <Text style={styles.highlightValueCompact}>{results.bindingYards} yds</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSolid,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    maxWidth: 1600,
    alignSelf: 'center',
    width: '100%',
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  logo: {
    width: 200,
    height: 40,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  headerResetButton: {
    margin: 0,
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dimensionInput: {
    flex: 1,
  },
  topSection: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  settingsPanel: {
    width: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E8EAED',
    ...theme.shadows.sm,
  },
  diagramArea: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  diagramContainer: {
    position: 'relative',
    backgroundColor: '#F5F7FA',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    borderWidth: 2,
    borderColor: '#D6DBDF',
    minHeight: 550,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  floatingWidthInput: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -100,
    zIndex: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    paddingTop: 0,
    ...theme.shadows.lg,
    minWidth: 200,
  },
  floatingLengthInput: {
    position: 'absolute',
    left: '100%',
    marginLeft: 20,
    top: '50%',
    marginTop: -60,
    zIndex: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    paddingTop: 0,
    ...theme.shadows.lg,
    minWidth: 200,
  },
  dragHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginBottom: -8,
    cursor: 'grab',
  },
  stepBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    ...theme.shadows.md,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inlineInputGroup: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  orientationButtons: {
    minWidth: 120,
  },
  iconButtonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  orientationIconButton: {
    margin: 0,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  diagramLegend: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  settingsGrid: {
    gap: theme.spacing.md,
  },
  settingSection: {
    marginBottom: theme.spacing.sm,
  },
  inputGrid: {
    gap: theme.spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  compactInput: {
    flex: 1,
  },
  fullWidthInput: {
    flex: 1,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  compactSegmented: {
    marginTop: theme.spacing.xs,
  },
  resetButton: {
    marginTop: theme.spacing.md,
    height: 48,
    justifyContent: 'center',
  },
  compactResetButton: {
    marginTop: 20,
    height: 48,
    justifyContent: 'center',
  },
  compactButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  input: {
    marginBottom: theme.spacing.sm,
    fontSize: 18,
  },
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    marginTop: theme.spacing.xl,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
  },
  buttonLabel: {
    fontSize: 18,
    paddingVertical: 8,
  },
  legend: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 2,
    borderTopColor: '#E8EAED',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  fractionalInputContainer: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  wholeNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wholeNumberInput: {
    width: 70,
    fontSize: 18,
    minHeight: 48,
    marginHorizontal: theme.spacing.xs,
  },
  arrowButtons: {
    justifyContent: 'center',
  },
  arrowButton: {
    margin: 0,
    padding: 0,
  },
  arrowButtonLarge: {
    margin: 0,
  },
  fractionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    borderRadius: 4,
    paddingHorizontal: theme.spacing.xs,
    width: 50,
    minHeight: 48,
  },
  fractionButtonText: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: '600',
  },
  menuItemText: {
    fontSize: 20,
  },
  numberInputContainer: {
    marginBottom: 0,
  },
  numberInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberInput: {
    flex: 1,
    fontSize: 18,
    marginRight: theme.spacing.sm,
    maxWidth: 100,
    minHeight: 48,
  },
  numberInputNarrow: {
    maxWidth: 70,
  },
  resultsRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  resultCardCompact: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E8EAED',
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  resultHeader: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
  },
  resultTitleCompact: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultBody: {
    padding: theme.spacing.md,
  },
  resultItem: {
    marginBottom: theme.spacing.sm,
  },
  resultLabelCompact: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  resultValueCompact: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  resultSubtext: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  highlightBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  highlightLabelCompact: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  highlightValueCompact: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  highlightSubtext: {
    fontSize: 11,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  fabricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  incrementText: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  resultLabel: {
    fontSize: 18,
    color: theme.colors.text,
    flex: 1,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'right',
  },
  highlightRow: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  highlightLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    flex: 1,
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'right',
  },
  bindingNote: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },

  // Mobile-specific styles
  scrollContentMobile: {
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  mainContainerMobile: {
    padding: theme.spacing.sm,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  logoMobile: {
    width: 120,
    height: 24,
  },
  subtitleMobile: {
    fontSize: 18,
    marginTop: theme.spacing.xs,
  },
  topSectionMobile: {
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
  settingsPanelMobile: {
    width: '100%',
    padding: theme.spacing.md,
  },
  diagramContainerMobile: {
    padding: theme.spacing.md,
    minHeight: 300,
  },
});