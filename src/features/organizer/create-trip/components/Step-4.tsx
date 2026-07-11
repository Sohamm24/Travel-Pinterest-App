import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';
import type { CreateTripFormValues } from '../types';

interface Props {
  watch: UseFormWatch<CreateTripFormValues>;
  setValue: UseFormSetValue<CreateTripFormValues>;
}

// ─── Picker constants ──────────────────────────────────────────────────────

const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOURS    = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES  = ['00', '15', '30', '45'];

// ─── Date picker modal ─────────────────────────────────────────────────────

function DatePickerModal({ visible, onConfirm, onCancel, colors }: any) {
  const today = new Date();
  const [day, setDay]     = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear]   = useState(today.getFullYear());
  const days  = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 3 }, (_, i) => today.getFullYear() + i);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={dp.overlay}>
        <View style={[dp.sheet, { backgroundColor: '#fff' }]}>
          <Text style={[dp.title, { color: colors.textPrimary }]}>Select Date</Text>
          <View style={dp.wheelRow}>
            <ScrollView style={dp.wheel} showsVerticalScrollIndicator={false}>
              {days.map((d) => (
                <TouchableOpacity key={d} onPress={() => setDay(d)}
                  style={[dp.item, day === d && { backgroundColor: colors.primaryLight ?? '#EDE9FA' }]}>
                  <Text style={[dp.itemText, { color: day === d ? colors.primary : colors.textPrimary }]}>
                    {String(d).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ScrollView style={dp.wheel} showsVerticalScrollIndicator={false}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity key={m} onPress={() => setMonth(i)}
                  style={[dp.item, month === i && { backgroundColor: colors.primaryLight ?? '#EDE9FA' }]}>
                  <Text style={[dp.itemText, { color: month === i ? colors.primary : colors.textPrimary }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ScrollView style={dp.wheel} showsVerticalScrollIndicator={false}>
              {years.map((y) => (
                <TouchableOpacity key={y} onPress={() => setYear(y)}
                  style={[dp.item, year === y && { backgroundColor: colors.primaryLight ?? '#EDE9FA' }]}>
                  <Text style={[dp.itemText, { color: year === y ? colors.primary : colors.textPrimary }]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={dp.actions}>
            <TouchableOpacity onPress={onCancel} style={[dp.cancelBtn, { borderColor: '#E5E7EB' }]}>
              <Text style={{ color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(`${String(day).padStart(2,'0')} ${MONTHS[month]} ${year}`)}
              style={[dp.confirmBtn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontFamily: TYPOGRAPHY.fontFamilySemiBold }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Time picker modal ─────────────────────────────────────────────────────

function TimePickerModal({ visible, onConfirm, onCancel, colors }: any) {
  const [hour, setHour]     = useState('06');
  const [minute, setMinute] = useState('00');
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={dp.overlay}>
        <View style={[dp.sheet, { backgroundColor: '#fff' }]}>
          <Text style={[dp.title, { color: colors.textPrimary }]}>Select Time</Text>
          <View style={dp.wheelRow}>
            <ScrollView style={dp.wheel} showsVerticalScrollIndicator={false}>
              {HOURS.map((h) => (
                <TouchableOpacity key={h} onPress={() => setHour(h)}
                  style={[dp.item, hour === h && { backgroundColor: colors.primaryLight ?? '#EDE9FA' }]}>
                  <Text style={[dp.itemText, { color: hour === h ? colors.primary : colors.textPrimary }]}>{h}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[dp.colon, { color: colors.textPrimary }]}>:</Text>
            <ScrollView style={dp.wheel} showsVerticalScrollIndicator={false}>
              {MINUTES.map((m) => (
                <TouchableOpacity key={m} onPress={() => setMinute(m)}
                  style={[dp.item, minute === m && { backgroundColor: colors.primaryLight ?? '#EDE9FA' }]}>
                  <Text style={[dp.itemText, { color: minute === m ? colors.primary : colors.textPrimary }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={dp.actions}>
            <TouchableOpacity onPress={onCancel} style={[dp.cancelBtn, { borderColor: '#E5E7EB' }]}>
              <Text style={{ color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(`${hour}:${minute}`)}
              style={[dp.confirmBtn, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontFamily: TYPOGRAPHY.fontFamilySemiBold }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const dp = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet:     { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 },
  title:     { fontSize: 16, fontFamily: TYPOGRAPHY.fontFamilyBold, textAlign: 'center', marginBottom: 16 },
  wheelRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 180 },
  wheel:     { flex: 1, maxHeight: 180 },
  item:      { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center' },
  itemText:  { fontSize: 15, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  colon:     { fontSize: 22, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 4 },
  actions:   { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  confirmBtn:{ flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
});

// ─── Tap-to-open field components ──────────────────────────────────────────

function DateTapField({ label, value, onChange, colors }: any) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.fieldWrapper}>
      {label && <Text style={[s.subLabel, { color: colors.textSecondary }]}>{label}</Text>}
      <TouchableOpacity
        style={[s.tapField, { borderColor: '#C7C7D4', backgroundColor: '#FAFAFA' }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Calendar color={value ? colors.primary : '#C4C4CF'} size={16} />
        <Text style={[s.tapText, { color: value ? colors.textPrimary : '#C4C4CF' }]}>
          {value || 'DD Mon YYYY'}
        </Text>
      </TouchableOpacity>
      <DatePickerModal visible={open}
        onConfirm={(v: string) => { onChange(v); setOpen(false); }}
        onCancel={() => setOpen(false)} colors={colors} />
    </View>
  );
}

function TimeTapField({ label, value, onChange, colors }: any) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.fieldWrapper}>
      {label && <Text style={[s.subLabel, { color: colors.textSecondary }]}>{label}</Text>}
      <TouchableOpacity
        style={[s.tapField, { borderColor: '#C7C7D4', backgroundColor: '#FAFAFA' }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Clock color={value ? colors.primary : '#C4C4CF'} size={16} />
        <Text style={[s.tapText, { color: value ? colors.textPrimary : '#C4C4CF' }]}>
          {value || 'HH : MM'}
        </Text>
      </TouchableOpacity>
      <TimePickerModal visible={open}
        onConfirm={(v: string) => { onChange(v); setOpen(false); }}
        onCancel={() => setOpen(false)} colors={colors} />
    </View>
  );
}

// ─── Text field with optional prefix ──────────────────────────────────────

function PricingField({ label, value, onChangeText, placeholder, prefix, keyboardType, colors }: any) {
  return (
    <View style={s.fieldWrapper}>
      <Text style={[s.fieldLabel, { color: colors.textPrimary }]}>{label}</Text>
      <View style={[s.inputRow, { borderColor: '#C7C7D4' }]}>
        {prefix && <Text style={[s.prefix, { color: colors.textPrimary }]}>{prefix}</Text>}
        <TextInput
          style={[s.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4C4CF"
          keyboardType={keyboardType ?? 'default'}
        />
      </View>
    </View>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function Step4Pricing({ watch, setValue }: Props) {
  const { colors } = useTheme();

  const maxTravellers     = watch('maxTravellers');
  const budget            = watch('budget');
  const confirmationAmount= watch('confirmationAmount');
  const confirmLastByDate = watch('confirmLastByDate');
  const confirmLastByTime = watch('confirmLastByTime');

  return (
    <View style={s.container}>
      <PricingField
        label="TOTAL SEATS"
        value={maxTravellers}
        onChangeText={(t: string) => setValue('maxTravellers', t)}
        placeholder="number of seats available in the trip"
        keyboardType="numeric"
        colors={colors}
      />
      <PricingField
        label="TRIP BUDGET PER PERSON"
        value={budget}
        onChangeText={(t: string) => setValue('budget', t)}
        placeholder=""
        prefix="₹"
        keyboardType="numeric"
        colors={colors}
      />
      <PricingField
        label="PRICE TO CONFIRM THE TRIP"
        value={confirmationAmount}
        onChangeText={(t: string) => setValue('confirmationAmount', t)}
        placeholder=""
        prefix="₹"
        keyboardType="numeric"
        colors={colors}
      />

      <View style={s.groupWrapper}>
        <Text style={[s.fieldLabel, { color: colors.textPrimary }]}>CONFIRM TRIP LAST BY</Text>
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <DateTapField
              label="Date"
              value={confirmLastByDate}
              onChange={(v: string) => setValue('confirmLastByDate', v)}
              colors={colors}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TimeTapField
              label="Time"
              value={confirmLastByTime}
              onChange={(v: string) => setValue('confirmLastByTime', v)}
              colors={colors}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:    { gap: 20 },
  groupWrapper: { gap: 8 },
  fieldWrapper: { gap: 5 },
  fieldLabel:   { fontSize: 12, fontFamily: TYPOGRAPHY.fontFamilyBold, letterSpacing: 0.8, textTransform: 'uppercase' },
  subLabel:     { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamily },
  inputRow:     { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 14, gap: 6 },
  prefix:       { fontSize: 22, fontFamily: TYPOGRAPHY.fontFamilyBold },
  input:        { flex: 1, fontSize: 15, fontFamily: TYPOGRAPHY.fontFamily, padding: 0 },
  tapField:     { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11 },
  tapText:      { fontSize: 14, fontFamily: TYPOGRAPHY.fontFamily, flex: 1 },
  row:          { flexDirection: 'row', gap: 12 },
});