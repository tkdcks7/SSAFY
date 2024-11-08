import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/BookDetail/RatingDistributionStyle.ts';

interface ReviewDistribution {
  average: number;
  [key: number]: number; // 예: 5점, 4점 등 각각의 점수 분포
}

interface RatingDistributionProps {
  reviewDistribution: ReviewDistribution;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ reviewDistribution }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>평점 분포</Text>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => {
          const filled = index + 1 <= Math.round(reviewDistribution.average);
          return (
            <Text key={index} style={filled ? styles.starFilled : styles.starEmpty}>
              ★
            </Text>
          );
        })}
        <Text style={styles.averageScore}>{reviewDistribution.average.toFixed(1)}</Text>
      </View>
      {Object.entries(reviewDistribution)
        .filter(([key]) => key !== 'average')
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([key, value]) => (
          <View key={key} style={styles.reviewBarContainer}>
            <Text style={styles.reviewText}>{key}점</Text>
            <View style={styles.reviewBar}>
              <View style={[styles.reviewBarFill, { width: `${value}%` }]} />
            </View>
            <Text style={styles.reviewPercentage}>{value}%</Text>
          </View>
        ))}
    </View>
  );
};

export default RatingDistribution;
