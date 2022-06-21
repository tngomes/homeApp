import { Animated, Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const TabsContainer = styled.ScrollView.attrs({
  flex: 1,
  horizontal: true,
  contentContainerStyle: { width: Dimensions.get('window').width * 1.5, paddingLeft: 20, paddingRight: 20 },
  showsHorizontalScrollIndicator: false,
})``;