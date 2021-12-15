import { flushPromises, shallowMount } from '@vue/test-utils';
import CurrencyExchange from '@/components/CurrencyExchange.vue';

const MOCK_CURRENCIES = [
  {"name":"Euro","symbol":"EUR"},
  {"name":"Dollar","symbol":"USD"},
  {"name":"Pound sterling","symbol":"GPB"},
  {"name":"Canadian Dollar","symbol":"CAD"}
];

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve(MOCK_CURRENCIES)
}));

describe('CurrencyExchange.vue', () => {

  const wrapper = shallowMount(CurrencyExchange);

  it('currency list', async() => {
    await flushPromises();
    expect(wrapper.vm.fromCurrencies).toEqual(MOCK_CURRENCIES);
  });

  it('test convert button', () => {
    const button = wrapper.find('button');
    expect(button).toBeTruthy();
    expect(button.text()).toEqual('Convert');
  });

  it('test if there are two dropdowns', () => {
    const dropdown1 =  wrapper.find('.curr-source');
    expect(dropdown1).toBeTruthy();

    const dropdown2 =  wrapper.find('.curr-target');
    expect(dropdown2).toBeTruthy();
  });

  it('test if there are two input boxes', () => {
    const input1 = wrapper.find('.amt-input');
    expect(input1).toBeTruthy();

    const input2 = wrapper.find('.final-input');
    expect(input2).toBeTruthy();
  });

  it('test validation', async() => {
    // click convert button
    await wrapper.find('button').trigger('click');
    expect(wrapper.vm.errors.length).toBeTruthy();

    // check errors variable has all the errors
    expect(wrapper.vm.errors.length).toEqual(3);

    // check the validation message
    expect(wrapper.vm.errors).toContainEqual( 'Please insert amount to be converted');
    expect(wrapper.vm.errors).toContainEqual( 'Please select a source currency');
    expect(wrapper.vm.errors).toContainEqual( 'Please select a target currency');

    // check non-numeric validation
    wrapper.vm.amount = 'abc';
    wrapper.vm.sourceCurrency = 'USD';
    wrapper.vm.targetCurrency = 'EUR';
    await wrapper.find('button').trigger('click');
    expect(wrapper.vm.errors.length).toEqual(1);
    expect(wrapper.vm.errors).toContainEqual( 'Amount should be a valid number');

    wrapper.vm.amount = 1;
    await wrapper.find('button').trigger('click');
    expect(wrapper.vm.errors.length).toEqual(0);
  });

});