import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { PlusCircle, XCircle, Calendar, Clock, X } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';
import { uploadMedia } from './Upload-media';

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Shape stored locally in formData.itinerary[].
 * Keeps UI-friendly date/time strings separate so the pickers work normally.
 * The backend payload is assembled in buildApiPayload() below.
 */
interface ItineraryItem {
  id: string;
  title: string;
  location: string;       // plain string for the text field
  date: string;           // "DD Mon YYYY" – UI only
  time: string;           // "HH:MM"       – UI only
  image: string | null;   // local preview URI or CDN URL
  imagePath: string | null; // confirmed bucket path → sent as `media`
  imageUploading?: boolean;
}

/**
 * Matches backend ItineraryActivity / LocationModel.
 * Sent to PATCH /{trip_id}/step2 inside { itinerary: [...] }.
 */
interface ItineraryActivityPayload {
  title: string;
  location: { name: string };   // LocationModel
  time: string;                 // ISO-8601 datetime string
  media: string;                // bucket path (imagePath)
}

/**
 * Converts the UI-friendly list into the shape the backend expects.
 * Call this right before the API request.
 */
export function buildStep2Payload(items: ItineraryItem[]): { itinerary: ItineraryActivityPayload[] } {
  return {
    itinerary: items.map((item) => ({
      title: item.title,
      location: { name: item.location },
      time: toIsoDateTime(item.date, item.time),
      media: item.imagePath ?? '',
    })),
  };
}

/** "DD Mon YYYY" + "HH:MM"  →  ISO-8601 string, e.g. "2025-12-25T06:00:00.000Z" */
function toIsoDateTime(dateStr: string, timeStr: string): string {
  // dateStr: "25 Dec 2025", timeStr: "06:00"
  if (!dateStr || !timeStr) return new Date().toISOString();
  const combined = `${dateStr} ${timeStr}`; // "25 Dec 2025 06:00"
  const parsed = new Date(combined);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

// ── Date / Time pickers ────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

function DatePickerModal({ visible, onConfirm, onCancel, colors }: any) {
  const today = new Date();
  const [day, setDay]     = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear]   = useState(today.getFullYear());
  const days  = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 3 },  (_, i) => today.getFullYear() + i);

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
                    {String(d).padStart(2,'0')}
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

// ── Reusable field components ──────────────────────────────────────────────

function TextField({ label, value, onChangeText, placeholder, colors }: any) {
  return (
    <View style={s.fieldWrapper}>
      <Text style={[s.fieldLabel, { color: colors.textPrimary }]}>{label}</Text>
      <TextInput
        style={[s.textField, { borderColor: '#C7C7D4', color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C4C4CF"
      />
    </View>
  );
}

function DateField({ label, value, onChange, colors }: any) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.fieldWrapper}>
      <Text style={[s.fieldLabel, { color: colors.textPrimary }]}>{label}</Text>
      <TouchableOpacity style={[s.pickerField, { borderColor: '#C7C7D4' }]} onPress={() => setOpen(true)}>
        <Calendar color={value ? colors.primary : '#C4C4CF'} size={16} />
        <Text style={[s.pickerText, { color: value ? colors.textPrimary : '#C4C4CF' }]}>
          {value || 'DD Mon YYYY'}
        </Text>
      </TouchableOpacity>
      <DatePickerModal visible={open} onConfirm={(v: string) => { onChange(v); setOpen(false); }}
        onCancel={() => setOpen(false)} colors={colors} />
    </View>
  );
}

function TimeField({ label, value, onChange, colors }: any) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.fieldWrapper}>
      <Text style={[s.fieldLabel, { color: colors.textPrimary }]}>{label}</Text>
      <TouchableOpacity style={[s.pickerField, { borderColor: '#C7C7D4' }]} onPress={() => setOpen(true)}>
        <Clock color={value ? colors.primary : '#C4C4CF'} size={16} />
        <Text style={[s.pickerText, { color: value ? colors.textPrimary : '#C4C4CF' }]}>
          {value || 'HH:MM'}
        </Text>
      </TouchableOpacity>
      <TimePickerModal visible={open} onConfirm={(v: string) => { onChange(v); setOpen(false); }}
        onCancel={() => setOpen(false)} colors={colors} />
    </View>
  );
}

// ── Itinerary image upload area ────────────────────────────────────────────

function ItineraryImagePicker({
  image, imageUploading, imageFailed, onPick, colors,
}: {
  image: string | null;
  imageUploading?: boolean;
  imageFailed?: boolean;
  onPick: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      style={[s.uploadArea, { backgroundColor: '#F3F4F6' }]}
      onPress={onPick}
      activeOpacity={0.7}
    >
      {image ? (
        <>
          <Image source={{ uri: image }} style={s.uploadPreview} />
          {imageUploading && (
            <View style={s.uploadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
          {imageFailed && !imageUploading && (
            <View style={s.failBadge}>
              <Text style={s.failText}>Failed · tap to retry</Text>
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={[s.uploadLabel, { color: '#C4C4CF' }]}>Upload Itinerary Image</Text>
          <PlusCircle color="#C4C4CF" size={26} strokeWidth={1.5} />
        </>
      )}
    </TouchableOpacity>
  );
}

// ── Itinerary card (summary row) ───────────────────────────────────────────

function ItineraryCard({ item, onRemove, colors }: { item: ItineraryItem; onRemove: () => void; colors: any }) {
  return (
    <View style={[s.card, { borderColor: '#E5E7EB' }]}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={s.cardImg} />
      ) : (
        <View style={[s.cardImgPlaceholder, { backgroundColor: '#F0F0F0' }]} />
      )}
      <View style={s.cardInfo}>
        <Text style={[s.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
        <View style={s.cardDateRow}>
          <View style={[s.dot, { backgroundColor: colors.primary }]} />
          <Text style={[s.cardMeta, { color: '#9CA3AF' }]}>{item.date} {item.time}</Text>
        </View>
        {!!item.location && (
          <Text style={[s.cardMeta, { color: '#9CA3AF' }]} numberOfLines={1}>{item.location}</Text>
        )}
        {item.imageUploading && (
          <Text style={[s.cardMeta, { color: colors.primary }]}>Uploading image…</Text>
        )}
        {!item.imageUploading && item.image && !item.imagePath && (
          <Text style={[s.cardMeta, { color: '#E53935' }]}>Image upload failed</Text>
        )}
      </View>
      <TouchableOpacity onPress={onRemove} hitSlop={8}>
        <XCircle color="#E53935" size={22} />
      </TouchableOpacity>
    </View>
  );
}

// ── Main Step 2 component ──────────────────────────────────────────────────

const EMPTY_DRAFT = {
  title: '',
  location: '',
  date: '',
  time: '',
  image: null as string | null,
  imagePath: null as string | null,
  imageUploading: false,
};

export default function Step2Itinerary({ formData, setFormData, tripId }: any) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  // ── Image pick + upload for the draft being composed ──
  const handlePickDraftImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const localUri = result.assets[0].uri;

    // Instant local preview
    setDraft((prev) => ({ ...prev, image: localUri, imagePath: null, imageUploading: true }));

    try {
      const compressed = await ImageManipulator.manipulateAsync(
        localUri,
        [{ resize: { width: 900 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const slotId = Date.now().toString();

      const { filePath, publicUrl } = await uploadMedia({
        localUri: compressed.uri,
        mimeType: 'image/jpeg',
        mediaContext: 'itinerary',
        tripId: tripId ?? 'draft',
        itinerarySlot: slotId,
      });

      setDraft((prev) => ({
        ...prev,
        image: publicUrl,
        imagePath: filePath,   // ← this becomes `media` in the API payload
        imageUploading: false,
        _slotId: slotId,
      } as any));
    } catch {
      Alert.alert('Upload failed', 'Image could not be uploaded. You can still add the item and retry.');
      setDraft((prev) => ({ ...prev, imageUploading: false }));
    }
  };

  const handleAdd = () => {
    if (!draft.title.trim()) return;
    const newItem: ItineraryItem = {
      id: (draft as any)._slotId || Date.now().toString(),
      title: draft.title,
      location: draft.location,
      date: draft.date,
      time: draft.time,
      image: draft.image,
      imagePath: draft.imagePath,
      imageUploading: draft.imageUploading,
    };
    setFormData((prev: any) => ({
      ...prev,
      itinerary: [...(prev.itinerary ?? []), newItem],
    }));
    setDraft(EMPTY_DRAFT);
  };

  const handleRemove = (id: string) =>
    setFormData((prev: any) => ({
      ...prev,
      itinerary: prev.itinerary.filter((i: ItineraryItem) => i.id !== id),
    }));

  return (
    <View style={s.container}>
      {/* Existing items */}
      {(formData.itinerary ?? []).length > 0 && (
        <View style={s.section}>
          <Text style={[s.sectionLabel, { color: colors.textPrimary }]}>ITINERARY</Text>
          {formData.itinerary.map((item: ItineraryItem) => (
            <ItineraryCard key={item.id} item={item} colors={colors} onRemove={() => handleRemove(item.id)} />
          ))}
        </View>
      )}

      {/* Draft form */}
      <View style={[s.addForm, { borderColor: '#E5E7EB' }]}>
        <TextField label="Itinerary title" value={draft.title}
          onChangeText={(t: string) => setDraft((p) => ({ ...p, title: t }))}
          placeholder="Pickup halt at Borivali East" colors={colors} />
        <TextField label="Location" value={draft.location}
          onChangeText={(t: string) => setDraft((p) => ({ ...p, location: t }))}
          placeholder="In front of city bank" colors={colors} />

        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <DateField label="Date" value={draft.date}
              onChange={(v: string) => setDraft((p) => ({ ...p, date: v }))} colors={colors} />
          </View>
          <View style={{ flex: 1 }}>
            <TimeField label="Time" value={draft.time}
              onChange={(v: string) => setDraft((p) => ({ ...p, time: v }))} colors={colors} />
          </View>
        </View>

        <ItineraryImagePicker
          image={draft.image}
          imageUploading={draft.imageUploading}
          imageFailed={!!draft.image && !draft.imagePath && !draft.imageUploading}
          onPick={handlePickDraftImage}
          colors={colors}
        />

        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: '#2D5A1B', opacity: draft.imageUploading ? 0.6 : 1 }]}
          onPress={handleAdd}
          activeOpacity={0.8}
          disabled={draft.imageUploading}
        >
          <Text style={s.addBtnText}>
            {draft.imageUploading ? 'Uploading image…' : 'Add Itinerary'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { gap: 16 },
  section:      { gap: 10 },
  sectionLabel: { fontSize: 12, fontFamily: TYPOGRAPHY.fontFamilyBold, letterSpacing: 0.8, textTransform: 'uppercase' },

  card:             { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 10, padding: 10 },
  cardImg:          { width: 72, height: 56, borderRadius: 8 },
  cardImgPlaceholder:{ width: 72, height: 56, borderRadius: 8 },
  cardInfo:         { flex: 1, gap: 3 },
  cardTitle:        { fontSize: 14, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  cardDateRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:              { width: 8, height: 8, borderRadius: 4 },
  cardMeta:         { fontSize: 12, fontFamily: TYPOGRAPHY.fontFamily },

  addForm:    { borderWidth: 1, borderRadius: 12, padding: 16, gap: 14 },
  fieldWrapper:{ gap: 5 },
  fieldLabel: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamily },
  textField:  { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, fontFamily: TYPOGRAPHY.fontFamily },
  pickerField:{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: '#FAFAFA' },
  pickerText: { fontSize: 14, fontFamily: TYPOGRAPHY.fontFamily, flex: 1 },
  row:        { flexDirection: 'row', gap: 12 },

  uploadArea:       { borderRadius: 10, height: 110, justifyContent: 'center', alignItems: 'center', gap: 8, overflow: 'hidden' },
  uploadPreview:    { width: '100%', height: '100%', borderRadius: 10 },
  uploadLabel:      { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamily },
  uploadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  failBadge:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(200,50,50,0.85)', paddingVertical: 6, alignItems: 'center' },
  failText:         { color: '#fff', fontSize: 12, fontFamily: TYPOGRAPHY.fontFamilySemiBold },

  addBtn:    { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  addBtnText:{ fontSize: 15, fontFamily: TYPOGRAPHY.fontFamilySemiBold, color: '#fff' },
});