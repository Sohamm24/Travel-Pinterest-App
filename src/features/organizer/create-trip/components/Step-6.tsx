import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function Step6DescriptionFAQ({ formData, setFormData }: any) {
  const { colors } = useTheme();
  const [draftQ, setDraftQ] = useState('');
  const [draftA, setDraftA] = useState('');

  const faqs: FAQ[] = formData.frequently_asked ?? [];

  const handleAddFAQ = () => {
    if (!draftQ.trim() || !draftA.trim()) return;
    const newFAQ: FAQ = { id: Date.now().toString(), question: draftQ.trim(), answer: draftA.trim() };
    setFormData({ ...formData, frequently_asked: [...faqs, newFAQ] });
    setDraftQ('');
    setDraftA('');
  };

  const handleRemoveFAQ = (id: string) => {
    setFormData({
      ...formData,
      frequently_asked: faqs.filter((f) => f.id !== id),
    });
  };

  return (
    <View style={styles.container}>
      {/* About This Trip */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>ABOUT THIS TRIP</Text>
        <TextInput
          style={[
            styles.descriptionInput,
            { borderColor: '#C7C7D4', color: colors.textPrimary },
          ]}
          value={formData.description}
          onChangeText={(t) => setFormData({ ...formData, description: t })}
          placeholder="write a description for the trip ( Max word limit 150)"
          placeholderTextColor="#C4C4CF"
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Existing FAQs */}
      {faqs.length > 0 && (
        <View style={styles.faqList}>
          {faqs.map((faq) => (
            <View
              key={faq.id}
              style={[styles.faqCard, { borderColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.faqQ, { color: colors.textPrimary }]}>Q: {faq.question}</Text>
                <Text style={[styles.faqA, { color: colors.textSecondary }]}>A: {faq.answer}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFAQ(faq.id)} hitSlop={8}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* FAQ Builder */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
          FREQUENTLY ASKED QUESTIONS
        </Text>
        <View style={[styles.faqForm, { borderColor: '#C7C7D4' }]}>
          <View style={styles.faqFieldWrapper}>
            <Text style={[styles.fieldSubLabel, { color: colors.textPrimary }]}>Question</Text>
            <TextInput
              style={[styles.faqInput, { borderColor: '#C7C7D4', color: colors.textPrimary }]}
              value={draftQ}
              onChangeText={setDraftQ}
              placeholder="Is this trip female friendly?"
              placeholderTextColor="#C4C4CF"
            />
          </View>
          <View style={styles.faqFieldWrapper}>
            <Text style={[styles.fieldSubLabel, { color: colors.textPrimary }]}>Answer</Text>
            <TextInput
              style={[styles.faqInput, { borderColor: '#C7C7D4', color: colors.textPrimary }]}
              value={draftA}
              onChangeText={setDraftA}
              placeholder="Yes we provide clean washrooms"
              placeholderTextColor="#C4C4CF"
            />
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: '#2D5A1B' }]}
            onPress={handleAddFAQ}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },

  section: { gap: 12 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  descriptionInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    minHeight: 180,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily,
    lineHeight: 20,
  },

  faqList: { gap: 10 },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  faqQ: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginBottom: 4 },
  faqA: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamily },
  removeText: { fontSize: 16, color: '#999', paddingTop: 2 },

  faqForm: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    gap: 14,
  },
  faqFieldWrapper: { gap: 6 },
  fieldSubLabel: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamily },
  faqInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily,
  },

  addBtn: {
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    color: '#fff',
  },
});