import React from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  isLoading?: boolean;
  colors?: string[];
  className?: string;
}

export function GradientButton({
  onPress,
  title,
  disabled = false,
  isLoading = false,
  colors = ["#EF4444", "#DC2626", "#881337"], // Luxury Crimson to Royal Burgundy
  className = "",
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`h-12 rounded-2xl overflow-hidden shadow-md shadow-red-200 active:opacity-90 ${className}`}
    >
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="luxuryRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {colors.map((c, i) => (
                <Stop
                  key={i}
                  offset={`${(i / (colors.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={16} fill="url(#luxuryRedGrad)" />
        </Svg>
      </View>
      <View className="flex-1 items-center justify-center">
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-sm tracking-wide">
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default GradientButton;
