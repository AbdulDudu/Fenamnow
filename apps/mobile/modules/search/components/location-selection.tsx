import { fetchCities, fetchCommunities } from "@/lib/data/location";
import {
  ChevronDownIcon,
  HStack,
  Icon,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  VStack
} from "@gluestack-ui/themed";
import { useQuery } from "@tanstack/react-query";

export default function LocationSelection({
  city,
  community,
  setCity,
  setCommunity
}: {
  city: string;
  setCity: (city: string) => void;
  community: string;
  setCommunity: (community: string) => void;
}) {
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: () => fetchCities(),
    staleTime: Infinity
  });

  const { data: communities } = useQuery({
    queryKey: [city],
    queryFn: () => fetchCommunities(city),
    enabled: city != null && city !== ""
  });

  return (
    <HStack justifyContent="space-between" my="$2" alignItems="center">
      <VStack width="47%" space="sm">
        <Text>City</Text>
        <Select
          width="$full"
          defaultValue={city}
          onValueChange={value => {
            if (value == "all") {
              setCity("");
              return;
            }
            setCity(value);
          }}
        >
          <SelectTrigger
            sx={{
              _light: {
                bg: "white"
              }
            }}
            variant="outline"
          >
            <SelectInput value={city} placeholder="Pick city" />
            {/* @ts-ignore */}
            <SelectIcon mr="$3">
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="All" value="all" />
              {cities?.data?.map(city => (
                <SelectItem key={city.id} label={city.name} value={city.name} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </VStack>

      <VStack width="47%" space="sm">
        <Text>Community</Text>
        <Select
          isDisabled={!city || city == ""}
          width="$full"
          defaultValue={community}
          onValueChange={setCommunity}
        >
          <SelectTrigger
            sx={{
              _light: {
                bg: "white"
              }
            }}
            variant="outline"
          >
            <SelectInput value={community} placeholder="Pick community" />
            {/* @ts-ignore */}
            <SelectIcon mr="$3">
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {city &&
                communities?.data?.map(community => (
                  <SelectItem
                    key={community.id}
                    value={community.name}
                    label={community.name}
                  />
                ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </VStack>
    </HStack>
  );
}
