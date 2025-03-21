import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import { NavbarDrawer } from "../NavbarDrawer";

interface NavbarProps {
  logoUrl: string;
  buildingNanoId: string;
}

export const Navbar = ({ logoUrl, buildingNanoId }: NavbarProps) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawerIsOpen = () => setDrawerIsOpen(!drawerIsOpen);

  return (
    <>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleDrawerIsOpen} style={styles.hamburgerIcon}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        {logoUrl && (
          <View style={styles.logoContainer}>
            <Image source={{ uri: logoUrl }} style={styles.logo} />
          </View>
        )}
      </View>

      <NavbarDrawer open={drawerIsOpen} toggleOpen={toggleDrawerIsOpen} buildingNanoId={buildingNanoId} />
    </>
  );
};
