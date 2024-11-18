import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import RNFS from 'react-native-fs';

const ViewDatabase: React.FC = () => {
  const [dbContent, setDbContent] = useState<string | null>(null);

  useEffect(() => {
    const loadDatabaseContent = async () => {
      try {
        const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
        const fileExists = await RNFS.exists(dbPath);

        if (fileExists) {
          const content = await RNFS.readFile(dbPath, 'utf8');
          setDbContent(content);
        } else {
          Alert.alert('알림', '데이터베이스 파일이 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('데이터베이스 읽기 중 오류:', error);
        Alert.alert('오류', '데이터베이스를 읽는 데 실패했습니다.');
      }
    };

    loadDatabaseContent();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>로컬 데이터베이스 내용</Text>
      <Text style={styles.content}>{dbContent || '데이터베이스가 비어 있습니다.'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
});

export default ViewDatabase;
