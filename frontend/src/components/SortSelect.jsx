export default function SortSelect({ id, options, value, onChange }) {
  return (
    <div className="inline-field">
      <label htmlFor={id}>Sort by</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  )
}
