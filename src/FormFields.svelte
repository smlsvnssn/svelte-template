<fieldset>
	<legend>Choose your favourite monster</legend>
	<div for="pet-select">Choose a pet:</div>

	<select name="pets" id="pet-select">
		<option value="">--Please choose an option--</option>
		<option value="dog">Dog</option>
		<option value="cat">Cat</option>
		<option value="hamster">Hamster</option>
		<option value="parrot">Parrot</option>
		<option value="spider">Spider</option>
		<option value="goldfish">Goldfish</option>
	</select>

	<input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" placeholder="Do something" />

	<datalist id="ice-cream-flavors">
		<option value="Chocolate" /><option value="Coconut" /><option value="Mint" /><option value="Strawberry" /><option value="Vanilla" /></datalist
	>

	<div for="fuel">Fuel level:</div>

	<meter id="fuel" min="0" max="100" low="33" high="66" optimum="80" value="50"> at 50/100 </meter>

	<div for="file">File progress:</div>

	<progress id="file" max="100" value="70"> 70% </progress>
	<progress id="file" max="100"> 70% </progress>
</fieldset>
<textarea id="story" name="story" rows="5" cols="33"> It was a dark and stormy night... </textarea>

<input type="radio" id="c1" name="x" checked />
<input type="radio" id="c2" name="x" />
<input type="radio" id="c2" name="x" disabled />

<input type="checkbox" checked />
<input type="checkbox" />
<input type="checkbox" disabled />
<br />

<div>button:</div>
<button>Button!</button>
<div>checkbox:</div>
<input type="checkbox" />
<div>color:</div>
<input type="color" value="#e70d0d" />
<div>date:</div>
<input type="date" />
<div>datetime-local:</div>
<input type="datetime-local" />
<div>email:</div>
<input type="email" />
<div>file:</div>
<input type="file" />
<div>month:</div>
<input type="month" />
<div>number:</div>
<input type="number" />
<div>password:</div>
<input type="password" />
<div>radio:</div>
<input type="radio" />
<div>range:</div>
<input type="range" />
<div>reset:</div>
<input type="reset" />
<div>search:</div>
<input type="search" />
<div>submit:</div>
<input type="submit" />
<div>tel:</div>
<input type="tel" />
<div>text:</div>
<input type="text" />
<div>time:</div>
<input type="time" />
<div>url:</div>
<input type="url" />
<div>week:</div>
<input type="week" />
