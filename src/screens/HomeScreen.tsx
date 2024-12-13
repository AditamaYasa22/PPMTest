import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { getMusics } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Music } from '../types/music';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MusicCollection'
>;

const HomeScreen = () => {
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width, height } = useWindowDimensions(); 
  const isLandscape = width > height; 

  const fetchMusics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMusics();
      setMusics(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch music list.');
      console.error('Error fetching musics:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMusics();
    }, [])
  );

  const renderMusicItem = ({ item }: { item: Music }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>
        {item.artist} - {item.genre} ({item.releaseYear})
      </Text>
      <Button
        title="Go To Details Music"
        onPress={() => navigation.navigate('DetailMusic', { id: item.id })}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading music list...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchMusics} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bagian Tombol */}
      <View
        style={[
          styles.buttonWrapper,
          {
            alignSelf: 'center', 
            marginBottom: isLandscape ? 20 : 10, 
          },
        ]}
      >
        <Button
          title="Add New Music"
          onPress={() => navigation.navigate('AddMusic')}
        />
      </View>

      {/* Bagian Daftar Musik */}
      <FlatList
        data={musics}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 10,
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMusicItem}
        ListEmptyComponent={<Text style={styles.empty}>No music available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonWrapper: {
    width: '100%',
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;
