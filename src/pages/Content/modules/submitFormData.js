import waitForElement from './waitForElement';

// all the columns used are listed:
// Firse name
// Last name

/**
 * Submits the form data to the form
 */
export default async function submitFormData(formData) {
  try {
    // Wait for the form to load
    /**
     * @type {HTMLFormElement}
     */
    const form = await waitForElement('form');
    const data = formData[0];
    console.info('data to submit:', data);
    if (!data['First name']) return;
    const elements = form.querySelectorAll('.box-body.with-border');
    // form.querySelector('#PatientId').value = data['Case ID'];

    setTimeout(() => {
      if (data['First name']) {
      }
      if (data['Last name']) {
      }
    }, 1000);
    // after submitting, remove the top item from the array, which is at the index 0
    formData.shift();
    // Save the updated array to localStorage
    localStorage.setItem('formData', JSON.stringify(formData));
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (err) {
    console.log('Error in submitFormData: ', err);
  }
}
