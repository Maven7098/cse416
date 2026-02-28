import { useState } from 'react';
import Pagination from './Pagination';
import Table from 'react-bootstrap/Table';
const pokemons = require('json-pokemon');

function ConceptTable() {
	const KANTO_PKMN_COUNT = 151;
	const PKMN_PER_PAGE = 15;
	const TOTAL_PAGES = Math.ceil(KANTO_PKMN_COUNT / PKMN_PER_PAGE);
	const ALL_PKMN = pokemons.slice(0, KANTO_PKMN_COUNT);
	const [paginatedPkmn, setPaginatedPkmn] = useState(
		ALL_PKMN.slice(0, PKMN_PER_PAGE)
	);
	const [active, setActive] = useState(1);

	const paginate = (pageNumber) => {
		const startIndex = (pageNumber - 1) * PKMN_PER_PAGE;
		const endIndex = pageNumber * PKMN_PER_PAGE;
		setActive(pageNumber);
		setPaginatedPkmn(ALL_PKMN.slice(startIndex, endIndex));
	};

	if (!ALL_PKMN || ALL_PKMN.length === 0) return <p>No Pokemon Found</p>;

	return (
		<>
			<Table variant="dark">
				<thead>
					<tr>
						<th className="id-col">
							<span className="pokemon-id">ID</span>
						</th>
						<th className="name-col">Name</th>
						<th className="type-col">Types</th>
					</tr>
				</thead>
				<tbody>
					{paginatedPkmn.map(
						(pokemon, index) =>
							index < KANTO_PKMN_COUNT && (
								<tr>
									<td>
										<span className="pokemon-id">{pokemon.id}</span>
									</td>
									<td>{pokemon.name}</td>
									<td>
										{pokemon.typeList.map((type) => (
											<>
												<span className={`type ${type.toLowerCase()}-type`}>
													{type}
												</span>{' '}
											</>
										))}
									</td>
								</tr>
							)
					)}
				</tbody>
			</Table>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Pagination
					paginate={paginate}
					active={active}
					totalPages={TOTAL_PAGES}
				/>
			</div>
		</>
	);
}

export default ConceptTable;