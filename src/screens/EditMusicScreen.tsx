import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getMusicById, updateMusic } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import axios from 'axios';
import { Music } from '../types/music';

const EditMusicScreen = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<RouteProp<RootStackParamList, 'EditMusic'>>();
  const navigation = useNavigation();
  const { id } = route.params;

  useEffect(() => {
    fetchMusicData();
  }, []);

  const fetchMusicData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMusicById(id);
      const music = response;
      setTitle(music.title);
      setArtist(music.artist);
      setGenre(music.genre);
      setReleaseYear(music.releaseYear.toString());
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch music details');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error fetching music data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    console.log('handleUpdate called'); // Tambahkan logging
    console.log({ title, artist, genre, releaseYear });
    if (!title || !artist || !genre || !releaseYear || isNaN(Number(releaseYear))) {
      Alert.alert('Validation Error', 'All fields are required, and Release Year must be a valid number.');
      return;
    }
    console.log('Validation passed');
    setUpdating(true);
    try {
      await updateMusic(id, {
        title,
        artist,
        genre,
        releaseYear: parseInt(releaseYear, 10),
      });
      console.log('updateMusic called successfully');
      Alert.alert('Success', 'Music updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to update music.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
      console.error('Error updating music:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator  testID="loading-indicator" size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchMusicData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={styles.input}
        placeholder="Release Year"
        value={releaseYear}
        keyboardType="numeric"
        onChangeText={setReleaseYear}
      />
      {updating ? (
        <ActivityIndicator  testID="loading-indicator" size="small" color="#0000ff" />
      ) : (
        <Button title="Update Music" onPress={handleUpdate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default EditMusicScreen;
