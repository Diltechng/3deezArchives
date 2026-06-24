const AddUserForm = ({ onClose }: {
  onClose?: () => void;
}) => {
  return (
    <form className="">
      <div>
        
      </div>
      <div className="flex gap-2 pt-3 justify-end mt-auto">
        <button
          type="button"
          className="button-ghost"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="button-primary"
        >
          Upload
        </button>
      </div>
    </form>
  )
}

export default AddUserForm;