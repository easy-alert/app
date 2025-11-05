import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useRequiredAuth } from "@/contexts/AuthContext";

import { NavbarDrawer } from "../NavbarDrawer";
import { SyncingBadge } from "../SyncingBadge";
import { styles } from "./styles";

export const Navbar = () => {
  const {
    company: { image },
  } = useRequiredAuth();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawerIsOpen = () => setDrawerIsOpen(!drawerIsOpen);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleDrawerIsOpen}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <SyncingBadge />
      </View>

      <NavbarDrawer open={drawerIsOpen} toggleOpen={toggleDrawerIsOpen} />
    </>
  );
};
