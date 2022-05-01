class Person {
	name: string;
	age: number;
	gender: boolean;

	constructor(name: string, age: number, gender: boolean) {
		this.gender = gender;
		this.name = name;
		this.age = age;
	}

	public displayInfo() {
		let genderName = "";
		if (this.gender) {
			genderName = "Male";
		} else {
			genderName = "Female";
		}
		print(string.format("%s | %s | %d", this.name, genderName, this.age));
	}

	public getName() {
		return this.name;
	}

	public getAge() {
		return this.age;
	}

	public getGender() {
		return this.gender;
	}
}

export default Person;
