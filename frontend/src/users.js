const emptyToNull = (value) => value || null

function toAddressRequest({ street, city, state, postalCode, country }) {
  return { street, city, country, state: emptyToNull(state), postalCode: emptyToNull(postalCode) }
}

export function toUserRequest(form) {
  return {
    username: form.username,
    email: form.email,
    password: form.password,
    age: form.age === '' ? null : Number(form.age),
    firstName: emptyToNull(form.firstName),
    lastName: emptyToNull(form.lastName),
    phoneNumber: emptyToNull(form.phoneNumber),
    addresses: (form.addresses ?? []).map(toAddressRequest),
  }
}
