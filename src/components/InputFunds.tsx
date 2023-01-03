import {
  FunctionComponent,
  useState,
  ChangeEvent,
  MouseEvent,
  SetStateAction,
  Dispatch,
} from "react"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"

import { InputAdornment } from "@material-ui/core"
import { BN } from "@polkadot/util"

interface Props {
  total: BN
  currency: string
  hidePercentages?: boolean
  setAmount: Dispatch<SetStateAction<string>>
  setShowValue: Dispatch<SetStateAction<string>>
  showValue: string
}

const InputFunds: FunctionComponent<Props> = ({
  total,
  setAmount,
  currency,
  hidePercentages = false,
  setShowValue,
  showValue,
}: Props) => {
  

  const handleChange = (e: ChangeEvent | MouseEvent, fromButtons = false) => {
    const value: string = (e.target as HTMLInputElement).value
    if (value) {
      const afterDot = value.split(".")[1]
      if (afterDot && afterDot.length > 6) return // only allow 6 decimals
    }
    if (fromButtons) {
      const calcNewTotal =
        parseFloat((e.currentTarget as HTMLButtonElement).value) *
        parseInt(new BN(total).toString())
      const truncDec = Math.trunc(calcNewTotal)
      setShowValue(
        calcNewTotal.toString() !== ""
          ? (truncDec / Math.pow(10, 9)).toFixed(6)
          : "",
      )
      setAmount(truncDec.toString())
      document.getElementById("SendFundsAmountField")?.focus()
    } else {
      const value = (e.currentTarget as HTMLButtonElement).value
      const v: number =
        parseFloat(value) * Math.pow(10, 9)
      setShowValue(value !== "" ? value : "")
      setAmount(value !== "" ? v.toString() : "0")
    }
  }

  // @TODO focus/blur TextField and %Buttons at the same time in a React way
  const [focus, setFocus] = useState<boolean>(false)
  const handleFocus = () => {
    setFocus(!focus)
  }

  return (
    <>
      <Box marginBottom={1}>
        <TextField
          id="SendFundsAmountField"
          value={showValue}
          label="Amount"
          fullWidth
          type="number"
          placeholder="0"
          variant="outlined"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          InputProps={{
            fullWidth: true,
            startAdornment: (
              <InputAdornment position="start">{currency}</InputAdornment>
            ),
          }}
        />
      </Box>

      {!hidePercentages && (
        <Grid container spacing={1}>
          {[
            { label: "25%", value: 0.25 },
            { label: "50%", value: 0.5 },
            { label: "75%", value: 0.75 },
            { label: "100%", value: 1 },
          ].map((item, index) => {
            return (
              <Grid key={index} item>
                <Button
                  onClick={(e) => handleChange(e, true)}
                  variant="outlined"
                  color={focus ? "primary" : undefined}
                  size="small"
                  value={item.value}
                >
                  {item.label}
                </Button>
              </Grid>
            )
          })}
        </Grid>
      )}
    </>
  )
}

export default InputFunds
