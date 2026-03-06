import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.bgCard,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarLabelStyle: {
                    fontFamily: Fonts.bodyMedium,
                    fontSize: 11,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    title: 'Transactions',
                    tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="budgets"
                options={{
                    title: 'Budgets',
                    tabBarIcon: ({ focused }) => <TabIcon icon="🎯" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="accounts"
                options={{
                    title: 'Accounts',
                    tabBarIcon: ({ focused }) => <TabIcon icon="💳" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
                }}
            />
        </Tabs>
    );
}
