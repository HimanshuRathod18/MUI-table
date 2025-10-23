export const sortProducts = async (sorting: any, pagination: any
) => {
        const {pageIndex, pageSize} = pagination;
        const sortId = sorting[0]?.id;
        const sortDesc = sorting[0]?.desc ? 'desc' : 'asc';
        const response = await fetch(`https://dummyjson.com/products?sortBy=${sortId}&order=${sortDesc}&limit=${pageSize}&skip=${pageIndex * pageSize}`);
        const data = await response.json();
        let products = data.products;
    
    return products;
}