import { test, expect, APIRequestContext } from '@playwright/test';

test('cappedAvailableTimes returns values for future dates', async ({ request }) => {

  const now = new Date();
  const tenDaysFromNow = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000));
  const fifteenDaysFromNow = new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000));
  const minimumDate = tenDaysFromNow.toISOString();
  const maximumDate = fifteenDaysFromNow.toISOString();
  console.log('minimumDate [' + minimumDate + ']'); 
  console.log('maximumDate [' + maximumDate + ']');

  const response = await fetchCappedAvailableTimes(request, minimumDate, maximumDate);  

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const length = responseBody.data.cappedAvailableTimes.length;
  console.log('Count of cappedAvailableTimes in response [' + length + ']');

  expect(length).toBeGreaterThan(0);
  
  const firstEntry = responseBody.data.cappedAvailableTimes[0];

  console.log('################ First Entry in Response ########################');
  console.log(JSON.stringify(firstEntry, null, 2));
  console.log('################ End - First Entry in Response ##################');

  expect(firstEntry).toHaveProperty('startTime');
  expect(firstEntry).toHaveProperty('endTime');
  expect(firstEntry.provider).toHaveProperty('id');
  expect(firstEntry.provider.id).not.toBeNull();
});


test('cappedAvailableTimes returns NO values for past dates', async ({ request }) => {

  const now = new Date();
  const tenDaysAgo = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000));
  const fifteenDaysAgo = new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000));
  const minimumDate = tenDaysAgo.toISOString();
  const maximumDate = fifteenDaysAgo.toISOString();
  console.log('minimumDate [' + minimumDate + ']'); 
  console.log('maximumDate [' + maximumDate + ']');

  const response = await fetchCappedAvailableTimes(request, minimumDate, maximumDate);  

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const length = responseBody.data.cappedAvailableTimes.length;
  expect(length).toBe(0);
});


async function fetchCappedAvailableTimes(
  request: APIRequestContext, 
  minimumDate: string,
  maximumDate: string,
  state: string = 'california',
  treatmentShortId: string = 'weightloss'
): Promise<Response> { 
  const response = await request.post('https://henry-prod.hasura.app/v1/graphql', {
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify({
      "operationName": "cappedAvailableTimes",
      "variables": {
        "minimumDate": minimumDate,
        "maximumDate": maximumDate,
        "state": state,
        "treatmentShortId": treatmentShortId
      },
      "query": `query cappedAvailableTimes($state: String!, $treatmentShortId: String!, $minimumDate: timestamptz!, $maximumDate: timestamptz!) {
        cappedAvailableTimes: appointment_capped_available_appointment_slots(
          where: {start_time: {_gt: $minimumDate, _lt: $maximumDate}, state: {_eq: $state}, treatment_object: {short_id: {_eq: $treatmentShortId}}, language: {_eq: "en-US"}, provider: {_and: {id: {_is_null: false}}}}
          order_by: {start_time: asc}
        ) {
          ...CappedAvailableSlotsFragment
          __typename
        }
      }
      
      fragment CappedAvailableSlotsFragment on appointment_capped_available_appointment_slots {
        startTime: start_time
        endTime: end_time
        provider {
          id
          displayName: display_name
          __typename
        }
        __typename
      }`
    })
  });

  return response;
}