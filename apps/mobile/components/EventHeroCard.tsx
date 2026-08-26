import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from "react-native-svg";
import { ArrowRight, Camera, Sparkles, MapPin, Calendar } from "lucide-react-native";
import { BRAND_COLORS } from "@bervic/shared";
import * as Haptics from "expo-haptics";

interface EventHeroCardProps {
  coupleTitle: string;
  eventDate: string;
  venuePlace: string;
  onEdit: () => void;
  onScan: () => void;
}

export function EventHeroCard({
  coupleTitle,
  eventDate,
  venuePlace,
  onEdit,
  onScan,
}: EventHeroCardProps) {
  const handleEditPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onEdit();
  };

  const handleScanPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onScan();
  };

  return (
    <View style={styles.cardContainer}>
      {/* Background SVG Gradient & Luxury Watermark Pattern */}
      <Svg
        width="100%"
        height="100%"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <LinearGradient id="heroRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#EF4444" />
            <Stop offset="35%" stopColor="#DC2626" />
            <Stop offset="70%" stopColor="#991B1B" />
            <Stop offset="100%" stopColor="#700B1A" />
          </LinearGradient>

          <RadialGradient id="radialShimmer" cx="90%" cy="10%" r="60%">
            <Stop offset="0%" stopColor="#FDE047" stopOpacity="0.25" />
            <Stop offset="60%" stopColor="#DC2626" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="ambientGlow" cx="10%" cy="90%" r="50%">
            <Stop offset="0%" stopColor="#F43F5E" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#700B1A" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill="url(#heroRedGrad)" rx={24} />
        <Rect width="100%" height="100%" fill="url(#radialShimmer)" rx={24} />
        <Rect width="100%" height="100%" fill="url(#ambientGlow)" rx={24} />

        <G opacity={0.12}>
          <Circle cx="92%" cy="15%" r="70" stroke="#FFF" strokeWidth="1" fill="none" />
          <Circle cx="92%" cy="15%" r="50" stroke="#FFF" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          <Circle cx="92%" cy="15%" r="30" stroke="#FFF" strokeWidth="1.5" fill="none" />
          <Circle cx="92%" cy="15%" r="12" fill="#FFF" />

          <Path
            d="M -10 180 C 40 120, 100 120, 150 180"
            stroke="#FFF"
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d="M -20 200 C 40 130, 120 130, 180 200"
            stroke="#FFF"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
          />

          <Path
            d="M 280 40 Q 285 50 295 55 Q 285 60 280 70 Q 275 60 265 55 Q 275 50 280 40 Z"
            fill="#FFF"
          />
          <Path
            d="M 50 110 Q 53 117 60 120 Q 53 123 50 130 Q 47 123 40 120 Q 47 117 50 110 Z"
            fill="#FFF"
          />
        </G>
      </Svg>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Top Badges Row */}
        <View style={styles.topBadgesRow}>
          <View style={styles.profileBadge}>
            <Sparkles size={11} color="#FDE047" />
            <Text style={styles.profileBadgeText}>Active Event Profile</Text>
          </View>

          <View style={styles.dateBadge}>
            <Calendar size={11} color="#FEE2E2" />
            <Text style={styles.dateBadgeText}>{eventDate}</Text>
          </View>
        </View>

        {/* Couple & Event Title */}
        <Text style={styles.title} numberOfLines={1}>
          {coupleTitle}
        </Text>

        {/* Venue & Location */}
        <View style={styles.venueRow}>
          <MapPin size={12} color="#FECDD3" />
          <Text style={styles.venueText} numberOfLines={1}>
            {venuePlace}
          </Text>
        </View>

        {/* Dual Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={handleEditPress}
            style={styles.editBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.editBtnText}>Edit Event Details</Text>
            <ArrowRight size={14} color={BRAND_COLORS.deepCrimson} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleScanPress}
            style={styles.scanBtn}
            activeOpacity={0.85}
          >
            <Camera size={15} color="#FFF" />
            <Text style={styles.scanBtnText}>Scan Card</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#700B1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  content: {
    padding: 20,
  },
  topBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  profileBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 4,
  },
  dateBadgeText: {
    color: "#FEE2E2",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 4,
  },
  venueText: {
    color: "#FEE2E2",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    gap: 6,
  },
  editBtnText: {
    color: "#991B1B",
    fontWeight: "800",
    fontSize: 12,
  },
  scanBtn: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  scanBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
});
