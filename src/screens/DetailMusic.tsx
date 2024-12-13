import React, { useCallback, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getMusicById, deleteMusic } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Music } from '../types/music';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types'; 

type DetailMusicScreenRouteProp = RouteProp<RootStackParamList, 'DetailMusic'>;
type DetailMusicScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DetailMusic'
>;

const DetailMusic = () => {
  const [music, setMusic] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<DetailMusicScreenRouteProp>();
  const navigation = useNavigation<DetailMusicScreenNavigationProp>();
  const { id } = route.params;

  useFocusEffect(
    useCallback(() => {
      fetchMusicDetail();
    }, [])
  );

  

  const fetchMusicDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const musicData = await getMusicById(id); 
      setMusic(musicData); 
    } catch (err: any) {
      setError(err.message || 'Failed to fetch music details');
      console.error('Error fetching music detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this music?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMusic(id); 
              Alert.alert('Success', 'Music deleted successfully');
              navigation.goBack(); 
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete music');
              console.error('Error deleting music:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchMusicDetail} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {music ? (
        <>
          <Text style={styles.title}>{music.title}</Text>
          <Text>Artist: {music.artist}</Text>
          <Text>Genre: {music.genre}</Text>
          <Text>Release Year: {music.releaseYear}</Text>
          <Button
            title="Edit"
            onPress={() => navigation.navigate('EditMusic', { id: music.id })}
          />
          <Button title="Delete" onPress={handleDelete} color="red" />
        </>
      ) : (
        <Text style={styles.error}>No data found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', textAlign: 'center', marginBottom: 20 },
});

export default DetailMusic;
