import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '../constants/theme';
import { mockCategories, mockAccounts } from '../constants/mockData';

type TxType = 'expense' | 'income' | 'transfer';

export default function AddTransactionScreen() {
    const [type, setType] = useState<TxType>('expense');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Add Transaction</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: Spacing.lg }}
            >
                {/* Type Selector */}
                <View style={styles.typeRow}>
                    {(['expense', 'income', 'transfer'] as TxType[]).map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[
                                styles.typeChip,
                                type === t && styles.typeChipActive,
                            ]}
                            onPress={() => setType(t)}
                        >
                            <Text
                                style={[
                                    styles.typeText,
                                    type === t && styles.typeTextActive,
                                ]}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Amount */}
                <View style={styles.amountBox}>
                    <Text style={styles.currency}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0"
                        placeholderTextColor={Colors.textMuted}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* Category */}
                <Text style={styles.label}>Category</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: Spacing.lg }}
                >
                    {mockCategories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.catChip,
                                selectedCategory === cat.id &&
                                styles.catChipActive,
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                            <Text
                                style={[
                                    styles.catText,
                                    selectedCategory === cat.id &&
                                    styles.catTextActive,
                                ]}
                            >
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Account */}
                <Text style={styles.label}>Account</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: Spacing.lg }}
                >
                    {mockAccounts.map((acc) => (
                        <TouchableOpacity
                            key={acc.id}
                            style={[
                                styles.catChip,
                                selectedAccount === acc.id &&
                                styles.catChipActive,
                            ]}
                            onPress={() => setSelectedAccount(acc.id)}
                        >
                            <Text style={{ fontSize: 18 }}>{acc.icon}</Text>
                            <Text
                                style={[
                                    styles.catText,
                                    selectedAccount === acc.id &&
                                    styles.catTextActive,
                                ]}
                            >
                                {acc.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Note */}
                <Text style={styles.label}>Note</Text>
                <TextInput
                    style={styles.noteInput}
                    placeholder="Add a note..."
                    placeholderTextColor={Colors.textMuted}
                    value={note}
                    onChangeText={setNote}
                    multiline
                />

                {/* Submit */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={[Colors.gradientStart, Colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.submitBtn}
                    >
                        <Text style={styles.submitText}>Save Transaction</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: 56,
        paddingBottom: Spacing.md,
    },
    cancel: {
        fontFamily: Fonts.bodyMedium,
        color: Colors.textSecondary,
        fontSize: 15,
    },
    title: {
        fontFamily: Fonts.heading,
        color: Colors.textPrimary,
        fontSize: 18,
    },
    typeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    typeChip: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: Radius.md,
        backgroundColor: Colors.bgCard,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        marginHorizontal: 4,
    },
    typeChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeText: {
        fontFamily: Fonts.bodyMedium,
        color: Colors.textSecondary,
        fontSize: 14,
    },
    typeTextActive: { color: Colors.white },
    amountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    currency: {
        fontFamily: Fonts.heading,
        color: Colors.textMuted,
        fontSize: 36,
        marginRight: 4,
    },
    amountInput: {
        fontFamily: Fonts.headingExtraBold,
        color: Colors.textPrimary,
        fontSize: 48,
        minWidth: 100,
    },
    label: {
        fontFamily: Fonts.bodyMedium,
        color: Colors.textSecondary,
        fontSize: 13,
        marginBottom: Spacing.sm,
    },
    catChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: 8,
        borderRadius: Radius.full,
        backgroundColor: Colors.bgCard,
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    catChipActive: {
        backgroundColor: Colors.primary + '30',
        borderColor: Colors.primary,
    },
    catText: {
        fontFamily: Fonts.bodyMedium,
        color: Colors.textSecondary,
        fontSize: 13,
        marginLeft: 6,
    },
    catTextActive: { color: Colors.primaryLight },
    noteInput: {
        backgroundColor: Colors.bgInput,
        borderRadius: Radius.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        fontFamily: Fonts.body,
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.xl,
    },
    submitBtn: {
        borderRadius: Radius.md,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitText: {
        fontFamily: Fonts.headingSemiBold,
        color: Colors.white,
        fontSize: 16,
    },
});
