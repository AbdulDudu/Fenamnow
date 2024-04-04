import { Input } from "@fenamnow/ui/components/ui/input";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";

export const PlacesAutocomplete = ({
  onAddressSelect,
  defaultValue
}: {
  onAddressSelect?: (
    address: string,
    coords?: { lat: number; lng: number }
  ) => void;
  defaultValue?: string;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "sl" } },
    googleMaps: {},
    defaultValue: defaultValue || "",
    debounce: 300,
    cache: 86400
  });

  const renderSuggestions = () => {
    return data.map(suggestion => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={async () => {
            setValue(description, false);
            clearSuggestions();
            const coords = await getGeocode({ address: description }).then(
              results => {
                const { lat, lng } = getLatLng(results[0]!);
                return { lat, lng };
              }
            );
            onAddressSelect && onAddressSelect(description, coords);
          }}
          className="hover:bg-accent flex min-h-[50px] w-full cursor-pointer items-center space-x-4 px-4"
        >
          <strong className="mr-4">{main_text}</strong>
          <small className="truncate">{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className="absolute z-10 w-full">
      <Input
        value={value}
        defaultValue={defaultValue}
        className=""
        disabled={!ready}
        onChange={e => setValue(e.target.value)}
        placeholder="123 Stariway To Heaven"
      />
      {status === "OK" && (
        <ul className="bg-background z-10 w-full">{renderSuggestions()}</ul>
      )}
    </div>
  );
};
