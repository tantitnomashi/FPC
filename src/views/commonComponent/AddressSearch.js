import zIndex from '@material-ui/core/styles/zIndex';
import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import ConfirmDialog from './Confirm';
export default function LocationSearchInput({ onSelectedLocation }) {


    const [address, setAddress] = useState('');
    const [building, setBuilding] = useState('');

    const handleChange = add => {
        setAddress(add);
    };

    const handleSelect = (address, placeId, suggestion) => {

        console.log('add', address, placeId, suggestion);
        geocodeByAddress(address)
            .then(results => {
                return getLatLng(results[0])
            })
            .then(latLng => {

                onSelectedLocation({
                    buildingName: suggestion.formattedSuggestion.mainText,
                    fullAddress: address,
                    latitude: `${latLng.lat}`,
                    longitude: `${latLng.lng}`
                });

            })
            .catch(error => console.error('Error', error));

    };
    const aaa = () => {
        return false;
    }


    return (
        <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}

        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <input
                        {...getInputProps({
                            placeholder: 'Search Places ...',
                            className: 'location-search-input form-control',
                        })}
                    />
                    <div className="autocomplete-dropdown-container position-absolute bg-white w-100 " style={{ zIndex: '9999' }} >
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                                ? 'suggestion-item--active p-2 border-bottom border-secondary'
                                : 'suggestion-item p-2 border-bottom border-secondary';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                    })}

                                >
                                    <span >{suggestion.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );

}