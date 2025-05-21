import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { NavbarDrawer } from "../NavbarDrawer";
import { OfflineQueueBadge } from "../OfflineQueueBadge";
import { styles } from "./styles";

export const Navbar = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawerIsOpen = () => setDrawerIsOpen(!drawerIsOpen);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleDrawerIsOpen}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <OfflineQueueBadge />
      </View>

      <NavbarDrawer open={drawerIsOpen} toggleOpen={toggleDrawerIsOpen} />
    </>
  );
};
