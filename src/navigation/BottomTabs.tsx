import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, useWindowDimensions } from 'react-native';
import HomeStack from '../navigation/HomeStack';
import AddMusicScreen from '../screens/AddMusicScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let iconSource;

          switch (route.name) {
            case 'HomeStack':
              iconSource = require('../assets/home.png'); 
              break;
            case 'AddMusic':
              iconSource = require('../assets/music.png'); 
              break;
            case 'Profile':
              iconSource = require('../assets/profile.png'); 
              break;
            default:
              iconSource = require('../assets/help.png'); 
              break;
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          display: isTablet ? 'none' : 'flex',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{title: 'Home'}} />
      <Tab.Screen name="AddMusic" component={AddMusicScreen} options={{title: 'AddMusic'}}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{title: 'Profile'}}/>
    </Tab.Navigator>
  );
};

export default BottomTabs;
