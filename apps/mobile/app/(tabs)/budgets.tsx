import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';
import { mockBudgets } from '../../constants/mockData';

export default function BudgetsScreen() {
    const totalLimit = mockBudgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = mockBudgets.reduce((s, b) => s + b.spent, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Budgets</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Budget Used</Text>
                <Text style={styles.summaryAmount}>
                    ₹{totalSpent.toLocaleString()} / ₹{totalLimit.toLocaleString()}
                </Text>
                <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${(totalSpent / totalLimit) * 100}%` }]} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {mockBudgets.map(b => {
                    const pct = (b.spent / b.limit) * 100;
                    const color = pct > 85 ? Colors.danger : pct > 60 ? Colors.warning : Colors.success;
                    return (
                        <View key={b.id} style={styles.budgetCard}>
                            <View style={styles.budgetHeader}>
                                <Text style={{ fontSize: 24 }}>{b.icon}</Text>
                                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                                    <Text style={styles.budgetName}>{b.category}</Text>
                                    <Text style={styles.budgetMeta}>{pct.toFixed(0)}% used</Text>
                                </View>
                                <Text style={[styles.budgetPct, { color }]}>{pct.toFixed(0)}%</Text>
                            </View>
                            <View style={styles.progressBg}>
                                <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
                            </View>
                            <View style={styles.budgetFooter}>
                                <Text style={styles.budgetFooterText}>₹{b.spent.toLocaleString()} spent</Text>
                                <Text style={styles.budgetFooterText}>₹{(b.limit - b.spent).toLocaleString()} left</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.sm },
    title: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 24 },
    summaryCard: {
        backgroundColor: Colors.bgCard,
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    summaryLabel: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 13 },
    summaryAmount: { fontFamily: Fonts.heading, color: Colors.textPrimary, fontSize: 22, marginVertical: Spacing.xs },
    progressBg: { height: 6, backgroundColor: Colors.bgInput, borderRadius: 3, marginTop: Spacing.xs },
    progressFill: { height: 6, borderRadius: 3, backgroundColor: Colors.primary },
    budgetCard: {
        backgroundColor: Colors.bgCard,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    budgetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
    budgetName: { fontFamily: Fonts.bodyMedium, color: Colors.textPrimary, fontSize: 15 },
    budgetMeta: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 12 },
    budgetPct: { fontFamily: Fonts.headingSemiBold, fontSize: 18 },
    budgetFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
    budgetFooterText: { fontFamily: Fonts.body, color: Colors.textSecondary, fontSize: 12 },
});
