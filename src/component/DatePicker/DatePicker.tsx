import React, { useState } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { t } from 'i18next';
import { Colors } from '../../utils/colors';

const DatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.WHITE }}>
      <Button color={Colors.PRIMARY} title={t('select_travel_date') || "Select Travel Date"} onPress={showDatePicker} />
      <Text style={{ marginTop: 15, color: Colors.PRIMARY }}>
        {t('selected')} {date.toDateString()}
      </Text>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          minimumDate={new Date()}
          textColor={Colors.PRIMARY}
          accentColor={Colors.PRIMARY}
          themeVariant="light"
          positiveButton={{ textColor: Colors.PRIMARY }}
          negativeButton={{ textColor: Colors.PRIMARY }}
        />
      )}
    </View>
  );
};

export default DatePicker;