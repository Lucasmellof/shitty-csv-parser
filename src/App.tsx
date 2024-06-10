import { createSignal, For, Show } from "solid-js";

import "./css/app.css";
import "./css/pico.violet.min.css";

function App() {
	const [data, setData] = createSignal<object[]>([]);
	const [filteredData, setFilteredData] = createSignal<object[]>([]);
	const [filter, setFilter] = createSignal<string>("");

	const [keyToCopy, setKeyToCopy] = createSignal<string | undefined>(undefined);

	let inputRef: HTMLInputElement;
	let selectRef: HTMLSelectElement;
	let selectCopyRef: HTMLSelectElement;

	const readFile = (e: ProgressEvent<FileReader>) => {
		const file = e.target.result;
		const lines = file.trim().split("\n");

		const keys = lines[0].split(",");

		// map all the lines to objects
		const data = lines.slice(1).map((line) => {
			const values = line.split(",");
			const obj: any = {};
			keys.forEach((key, i) => {
				obj[key] = values[i];
			});
			return obj;
		});
		setData(data);
		setFilteredData(data);
		if (selectRef) {
			selectRef.value = keys[0];
		}
	};

	const handleUpload = (e: HTMLInputElement) => {
		if (!e.files) return;
		const reader = new FileReader();
		reader.onload = (load) => readFile(load);
		reader.readAsText(e.files[0]);
	};

	const handleInputChange = (input: string) => {
		// filter key using (value signal) and value using input
		const filtered = data().filter((row) => {
			const value = row[filter()];
			if (value) {
				return value.toLowerCase().includes(input.toLowerCase());
			}
			return false;
		});
		setFilteredData(filtered);
	};

	return (
		<main class="container flex h-screen w-full flex-col items-center justify-center">
			<h1 class="text-[64px]">CSV Reader</h1>
			<div class="flex w-full flex-col items-center">
				<div class="flex items-center">
					<input type="file" id="file" accept=".csv" onChange={(e) => handleUpload(e.target)} />
				</div>
				<div class="flex w-2/3 gap-2">
					<select
						name="Selecione o filtro..."
						ref={selectRef}
						onChange={(e) => {
							const value = e.target.value;
							setFilter(value);
							if (inputRef) {
								inputRef.value = "";
								inputRef.focus();
							}
							setFilteredData(data());
						}}
					>
						<Show when={data().length >= 1}>
							<For each={Object.keys(data()[0])}>{(key) => <option value={key}>{key}</option>}</For>
						</Show>
					</select>
					<input
						type="text"
						class="input"
						placeholder="Digite o filtro..."
						onChange={(e) => handleInputChange(e.target.value)}
						ref={inputRef}
					/>
				</div>
			</div>
			<Show when={data().length >= 1}>
				<div class="my-6 flex gap-2">
					<select
						ref={selectCopyRef}
						onChange={(e) => {
							if (e.target.value.includes("all")) {
								setKeysToCopy(Object.keys(data()[0]));
							}
						}}
					>
						<Show when={data().length >= 1}>
							<For each={Object.keys(data()[0])}>
								{(key) => (
									<option value={key} selected>
										{key}
									</option>
								)}
							</For>
						</Show>
					</select>
					<button
						type="button"
						onClick={() => {
							// copy to clipboard all the values of the selected key
							const key = selectCopyRef.value;
							const values = filteredData().map((row) => row[key]);
							navigator.clipboard.writeText(values.join("\n"));
						}}
					>
						Copiar
					</button>
				</div>
			</Show>
			<Show when={data().length >= 1}>
				<div class="h-[600px] overflow-y-scroll">
					<table class="table-auto rounded-md">
						<thead>
							<tr>
								{Object.keys(data()[0]).map((key) => (
									<th>{key}</th>
								))}
							</tr>
						</thead>
						<For each={filteredData()}>
							{(row) => (
								<tr>
									{Object.values(row).map((value) => (
										<td>{value}</td>
									))}
								</tr>
							)}
						</For>
					</table>
				</div>
			</Show>
			<div>
				<Show when={data().length >= 1}>
					<p>Total de registros: {filteredData().length}</p>
				</Show>
			</div>
		</main>
	);
}

export default App;
