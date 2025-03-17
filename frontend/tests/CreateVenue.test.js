import { mount } from '@vue/test-utils';
import CreateVenue from '../src/components/CreateVenue.vue';

// DESCRIBE \._./
describe('CreateVenue.vue', () => {
  it('disables address field until city is selected', async () => {
    const wrapper = mount(CreateVenue);
    const addressInput = wrapper.find('#address');
    //address disabled
    expect(addressInput.attributes('disabled')).toBeDefined();
    await wrapper.find('#state').setValue('California');
    await wrapper.find('#city').setValue('Los Angeles');
    
    //address enabled
    expect(addressInput.attributes('disabled')).toBeUndefined();
  });
  it('disables venue name until address is entered', async () => {
    const wrapper = mount(CreateVenue);
    const venueNameInput = wrapper.find('#venue_name');
    //venue name disabled
    expect(venueNameInput.attributes('disabled')).toBeDefined();
    await wrapper.find('#state').setValue('California');
    await wrapper.find('#city').setValue('Los Angeles');
    await wrapper.find('#address').setValue('123 Hollywood Blvd');
    //venue name enabled
    expect(venueNameInput.attributes('disabled')).toBeUndefined();
  });
  it('disables description until venue name is entered', async () => {
    const wrapper = mount(CreateVenue);
    const descriptionInput = wrapper.find('#description');
    
    //description should be disabled
    expect(descriptionInput.attributes('disabled')).toBeDefined();
    await wrapper.find('#state').setValue('California');
    await wrapper.find('#city').setValue('Los Angeles');
    await wrapper.find('#address').setValue('123 Hollywood Blvd');
    await wrapper.find('#venue_name').setValue('Studio Space');
    //description enabled
    expect(descriptionInput.attributes('disabled')).toBeUndefined();
  });
  it('disables price field until description is entered', async () => {
    const wrapper = mount(CreateVenue);
    const priceInput = wrapper.find('#price');
    //price should be disabled
    expect(priceInput.attributes('disabled')).toBeDefined();
    await wrapper.find('#state').setValue('California');
    await wrapper.find('#city').setValue('Los Angeles');
    await wrapper.find('#address').setValue('123 Hollywood Blvd');
    await wrapper.find('#venue_name').setValue('Studio Space');
    await wrapper.find('#description').setValue('A modern studio space for events and photoshoots.');
    
    //price enabled
    expect(priceInput.attributes('disabled')).toBeUndefined();
  });
  
  it('disables capacity field until price is entered', async () => {
    const wrapper = mount(CreateVenue);
    const capacityInput = wrapper.find('#capacity');
    //shouldn't see capacity
    expect(capacityInput.attributes('disabled')).toBeDefined();
    await wrapper.find('#state').setValue('California');
    await wrapper.find('#city').setValue('Los Angeles');
    await wrapper.find('#address').setValue('123 Hollywood Blvd');
    await wrapper.find('#venue_name').setValue('Studio Space');
    await wrapper.find('#description').setValue('A modern studio space for events and photoshoots.');
    await wrapper.find('#price').setValue(200);
    
    //should see capacity now
    expect(capacityInput.attributes('disabled')).toBeUndefined();
  });
});
