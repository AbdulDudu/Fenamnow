import type { LeaseDurationTypes, PropertyType } from "@/lib/data/property";
import { AnimatedView } from "@/modules/common/ui/animated-view";
import NumberInput from "@/modules/common/ui/number-input";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Box,
  Button,
  ButtonText,
  Center,
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  CircleIcon,
  HStack,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  ScrollView,
  Switch,
  Text,
  useColorMode,
  useToken,
  VStack
} from "@gluestack-ui/themed";
import { Slider } from "@miblanchard/react-native-slider";
import { capitalize } from "lodash";
import { memo, useState } from "react";

function ExtraFilters({
  filters,
  setFilters,
  propertyTypes,
  leaseDurationTypes,
  resetFilters,
  applyFilters
}: {
  filters: any;
  setFilters: any;
  propertyTypes: PropertyType[] | null | undefined;
  leaseDurationTypes: LeaseDurationTypes[] | null | undefined;
  resetFilters: any;
  applyFilters: any;
}) {
  const colorMode = useColorMode();
  const primaryColor = useToken("colors", "primary300");
  const darkBackgroundColor = useToken("colors", "backgroundDark400");
  const lightBackgroundColor = useToken("colors", "backgroundLight200");
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState(filters.price_range);
  const [showThumbValue, setShowThumbValue] = useState(false);
  return (
    <Center>
      <Button variant="outline" onPress={() => setShowFiltersSheet(true)}>
        <ButtonText>Filters</ButtonText>
      </Button>
      <Actionsheet
        isOpen={showFiltersSheet}
        onClose={() => setShowFiltersSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent maxHeight="85%">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <HStack width="$full" pl="$4" my="$4">
            <Text semibold fontSize="$xl">
              Filters
            </Text>
          </HStack>
          <ScrollView width="$full" px="$4">
            <VStack
              flex={1}
              width="$full"
              space="lg"
              alignItems="flex-start"
              height="85%"
            >
              {/* Listing types */}
              <VStack>
                <Text>Listing type</Text>

                <RadioGroup
                  value={filters.listing_type as string}
                  onChange={isSelected => {
                    setFilters({ ...filters, listing_type: isSelected });
                  }}
                >
                  <HStack space="md" my="$2">
                    <Radio
                      value="rental"
                      size="md"
                      isInvalid={false}
                      isDisabled={false}
                    >
                      <RadioIndicator mr="$2">
                        {/* @ts-ignore */}
                        <RadioIcon as={CircleIcon} strokeWidth={1} />
                      </RadioIndicator>
                      <RadioLabel>Rental</RadioLabel>
                    </Radio>

                    <Radio
                      value="sale"
                      size="md"
                      isInvalid={false}
                      isDisabled={false}
                    >
                      <RadioIndicator mr="$2">
                        {/* @ts-ignore */}
                        <RadioIcon as={CircleIcon} strokeWidth={1} />
                      </RadioIndicator>
                      <RadioLabel>Sale</RadioLabel>
                    </Radio>

                    <Radio
                      value="lease"
                      size="md"
                      isInvalid={false}
                      isDisabled={false}
                    >
                      <RadioIndicator mr="$2">
                        {/* @ts-ignore */}
                        <RadioIcon as={CircleIcon} strokeWidth={1} />
                      </RadioIndicator>
                      <RadioLabel>Lease</RadioLabel>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </VStack>
              {/* Property types */}
              <VStack width="$full">
                <Text>Property types</Text>
                <CheckboxGroup
                  value={filters.property_types as string[]}
                  onChange={keys => {
                    setFilters({
                      ...filters,
                      property_types: keys
                    });
                  }}
                >
                  <HStack
                    my="$2"
                    alignItems="center"
                    flex={1}
                    flexWrap="wrap"
                    space="md"
                  >
                    {propertyTypes?.map(type => {
                      if (
                        filters.listing_type === "lease" &&
                        (type.name === "land" ||
                          type.name === "warehouse" ||
                          type.name === "bungalow")
                      ) {
                        return (
                          <AnimatedView key={type.created_at}>
                            <Checkbox value={type.name} aria-label="Checkbox">
                              <CheckboxIndicator mr="$2">
                                <CheckboxIcon as={CheckIcon} />
                              </CheckboxIndicator>
                              <CheckboxLabel>
                                {capitalize(type.name)}
                              </CheckboxLabel>
                            </Checkbox>
                          </AnimatedView>
                        );
                      }
                      if (filters.listing_type === "sale") {
                        return (
                          <AnimatedView key={type.created_at}>
                            <Checkbox value={type.name} aria-label="Checkbox">
                              <CheckboxIndicator mr="$2">
                                <CheckboxIcon as={CheckIcon} />
                              </CheckboxIndicator>
                              <CheckboxLabel>
                                {capitalize(type.name)}
                              </CheckboxLabel>
                            </Checkbox>
                          </AnimatedView>
                        );
                      }
                      if (
                        filters.listing_type === "rental" &&
                        (type.name === "duplex" ||
                          type.name === "apartment" ||
                          type.name === "bungalow")
                      ) {
                        return (
                          <AnimatedView key={type.created_at}>
                            <Checkbox value={type.name} aria-label="Checkbox">
                              <CheckboxIndicator mr="$2">
                                <CheckboxIcon as={CheckIcon} />
                              </CheckboxIndicator>
                              <CheckboxLabel>
                                {capitalize(type.name)}
                              </CheckboxLabel>
                            </Checkbox>
                          </AnimatedView>
                        );
                      }
                    })}
                  </HStack>
                </CheckboxGroup>
              </VStack>
              {/* Lease durations */}
              <VStack width="$full">
                <Text>Lease durations</Text>
                <CheckboxGroup
                  value={filters.lease_durations as string[]}
                  onChange={keys => {
                    setFilters({
                      ...filters,
                      lease_durations: keys
                    });
                  }}
                >
                  <HStack
                    my="$2"
                    alignItems="center"
                    flex={1}
                    flexWrap="wrap"
                    space="md"
                  >
                    {leaseDurationTypes?.map(type => (
                      <Checkbox
                        key={type.name}
                        value={type.name}
                        size="md"
                        aria-label="Checkbox"
                      >
                        <CheckboxIndicator mr="$2">
                          <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{capitalize(type.name)}</CheckboxLabel>
                      </Checkbox>
                    ))}
                  </HStack>
                </CheckboxGroup>
              </VStack>
              {/* Bedrooms */}
              <HStack
                justifyContent="space-between"
                alignItems="center"
                width="$full"
              >
                <Text>Bedrooms</Text>
                <NumberInput
                  value={filters.bedrooms}
                  increase={() => {
                    setFilters({
                      ...filters,
                      bedrooms: filters.bedrooms + 1
                    });
                  }}
                  decrease={() => {
                    setFilters({
                      ...filters,
                      bedrooms: filters.bedrooms - 1
                    });
                  }}
                />
              </HStack>
              {/* Bathrooms */}
              <HStack
                justifyContent="space-between"
                alignItems="center"
                width="$full"
              >
                <Text>Bathrooms</Text>
                <NumberInput
                  value={filters.bathrooms}
                  increase={() => {
                    setFilters({
                      ...filters,
                      bathrooms: filters.bathrooms + 1
                    });
                  }}
                  decrease={() => {
                    setFilters({
                      ...filters,
                      bathrooms: filters.bathrooms - 1
                    });
                  }}
                />
              </HStack>
              {/* Price range */}
              <VStack width="$full" space="md">
                <Text>Price range</Text>
                <Slider
                  value={filters.price_range}
                  thumbStyle={{
                    backgroundColor: primaryColor
                  }}
                  renderAboveThumbComponent={(value, index) =>
                    showThumbValue ? (
                      <AnimatedView>
                        <Box
                          px="$2"
                          sx={{
                            _light: {
                              bg: "$secondary600"
                            },
                            _dark: {
                              bg: "$secondary600"
                            },
                            ml: value == 0 ? "$0" : "-$24"
                          }}
                        >
                          <Text semibold>
                            ${tempPriceRange[value]?.toLocaleString()}
                          </Text>
                        </Box>
                      </AnimatedView>
                    ) : null
                  }
                  minimumValue={1000}
                  animateTransitions
                  step={1000}
                  maximumValue={1000000}
                  // onValueChange={value => {
                  //   setTempPriceRange(value);
                  // }}
                  maximumTrackStyle={{
                    backgroundColor:
                      colorMode == "dark"
                        ? darkBackgroundColor
                        : lightBackgroundColor
                  }}
                  minimumTrackStyle={{
                    backgroundColor:
                      colorMode == "dark"
                        ? darkBackgroundColor
                        : lightBackgroundColor
                  }}
                  onSlidingComplete={value => {
                    setFilters({
                      ...filters,
                      price_range: value
                    });
                    // setShowThumbValue(false);
                  }}
                />
                <HStack justifyContent="space-between">
                  <Text semibold>
                    ${filters?.price_range[0]?.toLocaleString()}
                  </Text>
                  <Text semibold>
                    ${filters?.price_range[1]?.toLocaleString()}
                  </Text>
                </HStack>
              </VStack>

              <HStack space="xl">
                {/* Furnished status */}
                <VStack alignItems="flex-start">
                  <Text>Furnished?</Text>
                  <Switch
                    value={filters.furnished}
                    onToggle={value => {
                      setFilters({
                        ...filters,
                        furnished: value
                      });
                    }}
                  />
                </VStack>
                {/* Negotiable status */}
                <VStack alignItems="flex-start">
                  <Text>Negotiable??</Text>
                  <Switch
                    value={filters.negotiable}
                    onToggle={value => {
                      setFilters({
                        ...filters,
                        negotiable: value
                      });
                    }}
                  />
                </VStack>
              </HStack>
            </VStack>
          </ScrollView>
          <HStack px="$4" my="$4" justifyContent="space-between" width="$full">
            <Button variant="outline" onPress={resetFilters}>
              <ButtonText>Reset</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowFiltersSheet(false);
                applyFilters();
              }}
            >
              <ButtonText>Apply</ButtonText>
            </Button>
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
    </Center>
  );
}

export default memo(ExtraFilters);
