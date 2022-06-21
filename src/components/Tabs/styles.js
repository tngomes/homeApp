import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(Animated.View)`
  height: 300px;
  margin-top: 20px;
`;

export const TabsContainer = styled.ScrollView.attrs({
  horizontal: true,
  contentContainerStyle: { paddingLeft: 10, paddingRight: 20 },
  showsHorizontalScrollIndicator: false,
})``;

export const TabItem = styled.View`
  width: 120px;
  height: 150px;
  background: rgba(255, 255, 255, 0.2);
  margin-left: 10px;
  padding: 10px;
  justifyContent: center;
  alignItems: center;
`;

export const TabText = styled.Text`
  font-size: 13px;
  color: #FFF;
  margin-left: 554px;
  margin-right: 560px;
  width: 100px;
`;
