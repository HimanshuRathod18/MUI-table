import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

export const MultiSelectAutocompleteFilter = ({ column, filterSelectOptions }: any) => {
    const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(filterSelectOptions ?? []);
  }, [filterSelectOptions]);
  const selectedValues = column.getFilterValue() || [];

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedValues}
      onChange={(_, newValues) => column.setFilterValue(newValues.length ? newValues : undefined)}
      limitTags={1}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
        />
      )}
      fullWidth
      disableCloseOnSelect
    />
  );
};