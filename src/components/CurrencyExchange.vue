<template>
  <div class="position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <!-- Origin-Currency -->
      <div class="col-6">
        <label for="OriginCurrency">From:</label>
        <div class="input-group mb-3">
          <select class="form-select classic" aria-label="OriginCurrency" @change="selectSourceCurrency($event)">
            <option value="null">Select Currency</option>
            <option v-for="curr in fromCurrencies" :key="curr.symbol" :value="curr.symbol">{{ curr.name }}</option>
          </select>
        </div>
        <input type="text" v-model="amount" class="form-control amt-input" id="formGroupExampleInput2" placeholder="Amount">
      </div>
      <!-- Destination Currency -->
      <div class="col-6">
        <label for="DestinationCurrency">To:</label>
        <div class="input-group mb-3">
          <select class="form-select classic" aria-label="OriginCurrency" @change="selectTargetCurrency($event)">
            <option value="null">Select Currency</option>
            <option v-for="curr in toCurrencies" :key="curr.symbol" :value="curr.symbol">{{ curr.name }}</option>
          </select>
        </div>
        <input type="text" v-model="finalAmount" class = "form-control amt-input" id="formGroupExampleInput2" placeholder="Amount">
      </div>
    </div>
    <div v-if="errors.length" class="errors">
    <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
    <!-- Convert Button -->
    <div class="d-grid gap-2 col-4 mx-auto ">
      <button class="btn btn-primary btn-lg convert-btn" type="submit" v-on:click="convert()">Convert</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Exchange',
  props: {
    msg: String
  },
  data() {
    return {
      fromCurrencies: {},
      toCurrencies: {},
      sourceCurrency: '',
      targetCurrency: '',
      amount: 0,
      finalAmount: 0,
      errors: [],
    }
  },
  beforeMount(){
    this.getCurrency();
  },
  methods: {
    async getCurrency(){
      // get the list of currency
      const res = await fetch('https://61a0fad86c3b400017e69b41.mockapi.io/currencies');
      this.fromCurrencies = await res.json();
    },
    selectSourceCurrency(event) {
      this.sourceCurrency = event.target.value;

      // remove selected currency from the target currencies list
      const filtersList = this.fromCurrencies.filter(element => element.symbol !== this.sourceCurrency);
      this.toCurrencies = filtersList;
    },
    selectTargetCurrency(event) {
      this.targetCurrency = event.target.value;
    },
    convert() {
      this.errors = [];

      // validation
      if (!this.amount) {
        this.errors.push('Please insert amount to be converted');
      }
      if (isNaN(this.amount)) {
        this.errors.push('Amount should be a valid number');
      }
      if (!this.sourceCurrency) {
        this.errors.push('Please select a source currency.');
      }
      if (!this.targetCurrency) {
        this.errors.push('Please select a target currency');
      }
      
      if (this.errors.length == 0) {
        const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
             "from": this.sourceCurrency,
              "to": this.targetCurrency,
              "amount": this.amount
          })
      };

      // make post api call to get the amount exchanged
      fetch("https://61a0fad86c3b400017e69b41.mockapi.io/exchange", requestOptions)
        .then(response => response.json())
        .then(data => this.finalAmount = data['amount_exchanged']);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

select {
  /* styling */
  background-color: white;
  border: thin solid #ced4da;
  border-radius: 4px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;
  padding: 0.5em 3.5em 0.5em 1em;
}

/* arrows */
select.classic {
  background-image:
    linear-gradient(45deg, transparent 50%, white 50%),
    linear-gradient(135deg, white 50%, transparent 50%),
    linear-gradient(to right, skyblue, skyblue);
  background-position:
    calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px),
    100% 0;
  background-size:
    5px 5px,
    5px 5px,
    2.5em 2.5em;
  background-repeat: no-repeat;
}

select.classic:focus {
  background-image:
    linear-gradient(45deg, white 50%, transparent 50%),
    linear-gradient(135deg, transparent 50%, white 50%),
    linear-gradient(to right, gray, gray);
  background-position:
    calc(100% - 15px) 1em,
    calc(100% - 20px) 1em,
    100% 0;
  background-size:
    5px 5px,
    5px 5px,
    2.5em 2.5em;
  background-repeat: no-repeat;
  border-color: grey;
  outline: 0;
}

.amt-input{
  border-radius: 0%;
}
.convert-btn{
  margin-top: 30px;
}

.errors {
  color: red;
}

</style>
