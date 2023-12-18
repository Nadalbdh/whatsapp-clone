import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import ListProfils from '../Home/ListProfils';
import Group from '../Home/Groupe';
import MyAccount from '../Home/MyAccount';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab=createMaterialBottomTabNavigator();

export default function Accueil(props) {
  const currentid =props.route.params.currentid;
  return (
   <Tab.Navigator
   
   activeColor="white"
      barStyle={{ backgroundColor: '#FFC436', height:75 }}
   >
    <Tab.Screen initialParams={{currentid}} name="ListProfils" component={ListProfils}  options={{
          tabBarLabel: 'Contact List',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="menu" color={color} size={20} />
          ),
        }}/>
    <Tab.Screen name="Group"component={Group}
    options={{
      tabBarLabel: 'Groups',
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="account-group" color={color} size={20} />
      ),
    }}
    />
    <Tab.Screen initialParams={{currentid}} name="MyAccount" component={MyAccount}
     options={{
      tabBarLabel: 'My Account',
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="account" color={color} size={20} />
      ),
    }}/>
    </Tab.Navigator>
  )
}