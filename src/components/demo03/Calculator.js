import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import styles from './Calculator.module.scss';


class CalculatorResult extends Component {
    constructor(props) {
        super(props)
        this.state = { calculate: "", number: 0 }
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(this.props.currentFormula)) {
            this.props.currentFormula = this.props.currentFormula.replace(pattern, "$1,$2");
        }
        while (pattern.test(this.props.result)) {
            this.props.result = this.props.result.replace(pattern, "$1,$2");
        }
        this.setState({ calculate: this.props.currentFormula, number: this.props.result })
    }
    render() {
        return (
            <div className={styles.result}>
                <p className={styles.result_calculate}>{this.props.currentFormula}</p>
                <p className={styles.result_number} style={{ 'font-size': (this.props.result.toString().length < 10) ? "56px" : "30px" }}>{this.props.result}</p>
            </div>
        )
    }
}
class CalculatorCount extends Component {
    constructor(props) {
        super(props)
        let numbers = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "00", "."];
        let operators = ["÷", "×", "+", "-"];
        this.numberItem = numbers.map((item) =>
            <div className={styles.number + " " + styles.block} onClick={this.props.enterNumber.bind(this, item)}>{item}</div>
        );
        this.operatorItem = operators.map((item) =>
            <div className={styles.number.operator + " " + styles.block} onClick={this.props.enterOperator.bind(this, item)}>{item}</div>
        )
        // this.props.enterNumber = this.props.enterNumber.bind(this)
        // this.props.enterOperator = this.props.enterOperator.bind(this)
    }
    render() {
        return (
            <div className={styles.count}>
                <div className={styles.count_number} >
                    {this.numberItem}
                </div>
                <div className={styles.count_operator}>
                    {this.operatorItem}
                </div>
                <div className={styles.count_bottom}>
                    <div className={styles.count_bottom_back + " " + styles.block} onClick={this.props.empty}>AC</div>
                    <div className={styles.count_bottom_back + " " + styles.block} onClick={this.props.back}>⌫</div>
                    <div className={styles.count_bottom_equal} onClick={this.props.equal}>=</div>
                </div>
            </div>
        )
    }
}
class Calculator extends Component {
    constructor(props) {
        super(props)
        this.state = { currentFormula: "", pendingNumber: "", result: 0, pendingResult: 0 }
    }
    enterNumber() {
        return (e) => {
            let { currentFormula, pendingNumber } = this.state
            if (currentFormula === "") {
                this.setState({
                    pendingNumber: "" + e,
                    result: 0,
                    pendingResult: 0,
                    currentFormula: this.thousandComma(currentFormula + e)
                })
            } else {
                this.setState({
                    pendingNumber: pendingNumber + e,
                    currentFormula: this.thousandComma(currentFormula + e)
                })
            }
            console.log(pendingNumber)
        }
    }
    enterOperator() {
        return (e) => {
            let { currentFormula, pendingNumber, result, pendingResult } = this.state
            console.log(currentFormula + ',' + pendingNumber + ',' + result + ',' + pendingResult)
            if (currentFormula.charAt(currentFormula.length - 1) !== " ") {
                if (pendingNumber === "" && currentFormula === "") {
                    pendingNumber = +"0"
                    currentFormula = +"0"
                }
                else if (result !== 0 && currentFormula === "") {
                    currentFormula = pendingResult
                }
                if (pendingNumber.split(" ").length > 2) {
                    console.log('calc')
                    let calc = this.calc(pendingNumber.split(" "))
                    this.setState({
                        pendingNumber: calc + " " + e + " ",
                        currentFormula: currentFormula + " " + e + " ",
                        result: this.thousandCommaResult(calc),
                        pendingResult: calc
                    })
                } else {
                    this.setState({
                        pendingNumber: pendingNumber + " " + e + " ",
                        currentFormula: currentFormula + " " + e + " ",
                    })
                }
            }
        }
    }
    empty() {
        return (e) => {
            this.setState({
                currentFormula: "",
                result: 0,
                pendingResult: 0,
                pendingNumber: ""
            })
        }
    }
    back() {
        return (e) => {
            let { currentFormula, pendingNumber } = this.state
            if (currentFormula.charAt(currentFormula.length - 1) !== "") {
                currentFormula = currentFormula.substring(0, currentFormula.length - 1);
                pendingNumber = pendingNumber.substring(0, pendingNumber.length - 1);
            } else {
                currentFormula = currentFormula.substring(0, currentFormula.length - 4);
                pendingNumber = pendingNumber.substring(0, pendingNumber.length - 4);
            }
            if (currentFormula.length === 0) {
                this.setState({
                    currentFormula: "",
                    pendingNumber: "",
                    result: 0,
                    pendingResult: 0
                })
            } else {
                this.setState({
                    currentFormula: currentFormula,
                    pendingNumber: pendingNumber
                })
            }
        }
    }
    equal() {
        return (e) => {
            let { pendingNumber } = this.state
            let calc = this.calc(pendingNumber.split(" "))

            this.setState({
                currentFormula: "",
                result: this.thousandCommaResult(calc),
                pendingResult: calc
            })
        }
    }
    calc(currentFormula) {
        switch (currentFormula[1]) {
            case '+':
                return Number(currentFormula[0]) + Number(currentFormula[2])
            case '-':
                return Number(currentFormula[0]) - Number(currentFormula[2])
            case '×':
                return Number(currentFormula[0]) * Number(currentFormula[2])
            case '÷':
                return Number(currentFormula[0]) / Number(currentFormula[2])
            default:
                return 0;
        }
    }
    thousandCommaResult(number) {
        return number.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
    thousandComma(number) {
        number = number.toString().split(",").join("")
        return number.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
    render() {
        return (
            <div className={styles.demo03}>
                <div className={styles.calculator}>
                    <CalculatorResult currentFormula={this.state.currentFormula} result={this.state.result} />
                    <CalculatorCount enterNumber={this.enterNumber()} enterOperator={this.enterOperator()} empty={this.empty()} back={this.back()} equal={this.equal()} />
                </div>
            </div>
        )
    }
}

export default Calculator

// window.addEventListener("load", () => {
//     let myComponent =<Calculator />
//     ReactDOM.render(myComponent, document.getElementById('root'));
// });
