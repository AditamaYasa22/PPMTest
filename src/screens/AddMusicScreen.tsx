import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createMusic } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Music } from '../types/music';

const AddMusicScreen = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | null>(null);
  const navigation = useNavigation();

  const handleAddMusic = async () => {
    if (!title || !artist || !genre || releaseYear === null) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const newMusic: Omit<Music, 'id'> = {
        title,
        artist,
        genre,
        releaseYear,
      };

      await createMusic(newMusic);

      navigation.goBack();
    } catch (error) {
      console.error('Error adding music', error);
      Alert.alert('Error', 'Failed to add music');
    }
  };

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
        value={releaseYear !== null ? releaseYear.toString(): ''}
        keyboardType="numeric"
        onChangeText={(text) => setReleaseYear(text ? parseInt(text, 10) : null)}
      />
      <Button title="Add Music" onPress={handleAddMusic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default AddMusicScreen;
