export type RootTabParamList = {
    MusicCollection: undefined;  // Tidak ada parameter untuk Home
    AddMusic: undefined;  // Tidak ada parameter untuk AddMusic
    Profile: undefined;  // Tidak ada parameter untuk Profile
  };
  
  export type RootStackParamList = {
    MusicCollection: undefined;  // Tidak ada parameter untuk Home
    AddMusic: undefined;  // Tidak ada parameter untuk AddMusic
    Profile: undefined;  // Tidak ada parameter untuk Profile
    DetailMusic: { id: string };  // Parameter id untuk DetailMusic
    EditMusic: { id: string };  // Parameter id untuk EditMusic
  };
  