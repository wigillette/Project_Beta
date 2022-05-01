class Person {
	private name: string;
	private age: number;
	private gender: boolean;

	constructor(name: string, age: number, gender: boolean) {
		this.gender = gender;
		this.name = name;
		this.age = age;
	}

	displayInfo() {
		let genderName = "";
		if (this.gender) {
			genderName = "Male";
		} else {
			genderName = "Female";
		}
		print(string.format("%s | %s | %d", this.name, genderName, this.age));
	}
}

export default Person;
