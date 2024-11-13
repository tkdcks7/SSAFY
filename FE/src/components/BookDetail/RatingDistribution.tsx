import React from 'react';
import { View, Text, AccessibilityInfo } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import styles from '../../styles/BookDetail/RatingDistributionStyle';

interface ReviewDistribution {
  average: number;
  totalCount: number; // 전체 리뷰 수
  [key: number]: number; // 각 평점 분포
}

interface RatingDistributionProps {
  reviewDistribution: ReviewDistribution;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ reviewDistribution }) => {
  const renderStars = (average: number, totalCount: number) => {
    const filledStars = Math.floor(average);
    const partialStar = average - filledStars;

    return (
      <View
        style={styles.starsContainer}
        accessibilityLabel={`평균 평점: ${average.toFixed(1)}점 (${totalCount}개 리뷰)`}
        accessibilityRole="text"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Svg
            key={i}
            width={30}
            height={30}
            viewBox="0 0 24 24"
            accessibilityLabel={i < filledStars ? "별 가득 참" : i === filledStars ? "부분적으로 참" : "별 비어 있음"}
          >
            <Defs>
              <LinearGradient id={`grad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop
                  offset={i < filledStars ? "100%" : i === filledStars ? `${partialStar * 100}%` : "0%"}
                  stopColor="#3943B7"
                />
                <Stop
                  offset={i < filledStars ? "100%" : i === filledStars ? `${partialStar * 100}%` : "0%"}
                  stopColor="#DDDDDD"
                />
              </LinearGradient>
            </Defs>
            <Path
              d="M12 .587l3.668 7.429 8.166 1.174-5.902 5.796 1.394 8.14L12 18.902 4.674 23.126l1.394-8.14L.166 9.19l8.166-1.174z"
              fill={`url(#grad${i})`}
            />
          </Svg>
        ))}
        <Text style={styles.averageScore}>
          {average.toFixed(1)} <Text style={styles.totalCount}>({totalCount}개 리뷰)</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessibilityLabel="평점 분포"
        accessibilityRole="header"
      >
        평점 분포
      </Text>
      {renderStars(reviewDistribution.average, reviewDistribution.totalCount)}
      {Object.entries(reviewDistribution)
        .filter(([key]) => key !== 'average' && key !== 'totalCount') // totalCount는 제외
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([key, value]) => (
          <View
            key={key}
            style={styles.reviewBarContainer}
            accessibilityLabel={`${key}점: ${value}%`}
            accessibilityRole="text"
          >
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
