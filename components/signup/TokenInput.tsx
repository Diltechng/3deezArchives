import { ControllerRenderProps } from "react-hook-form";
import { OTPInput, SlotProps } from "input-otp";


type FormValues = {
  token: string;
  userId: string;
}

type TokenInputProps = ControllerRenderProps<FormValues, "token">

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex justify-center items-center animate-caret-blink">
      <div className="w-px h-6 bg-current" />
    </div>
  )
}

function InputSlot({ slot }: {
  slot: SlotProps;
}) {
  return (
    <div className={`
      relative flex justify-center items-center rounded-md w-10 h-12 text-2xl border bg-neutral-100 dark:bg-neutral-900
      ${slot.isActive? "border-sky-500" : "border-neutral-300 dark:border-neutral-700"}
    `}>
      {slot.hasFakeCaret && <FakeCaret />}
      {slot.char ?? ""}
    </div>
  )
}

function InputSlotGroup({ slots }: {
  slots: SlotProps[]
}) {
  return (
    <div className="flex gap-1">
      {slots.map((slot, idx) => <InputSlot slot={slot} key={idx} />)}
    </div>
  )
}

const TokenInput = (props: TokenInputProps) => {

  function blockNonNumeric(value: string) {
    if (!/^\d*$/.test(value)) return;
    const length = 6
    const newValue = value.slice(0, length);
    props.onChange(newValue)
  }

  return (
    <OTPInput
      {...props}
      value={props.value ?? ""}
      onChange={blockNonNumeric}
      maxLength={6}
      pattern="\d*"
      render={({ slots }) => 
        <InputSlotGroup slots={slots} />
      } />
  )
}

export default TokenInput;